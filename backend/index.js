const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

dotenv.config();

// =============================================================
// Helper: Safer resolver (Optional)
// =============================================================
function mustResolve(p) {
  try {
    const resolved = require.resolve(p);
    console.log(`✅ Resolved: ${p} -> ${resolved}`);
    return require(p);
  } catch (err) {
    console.error(`❌ Cannot resolve: ${p}`);
    throw err;
  }
}

// =============================================================
// DB Connection
// =============================================================
const connectDB = mustResolve('./config/db');

// =============================================================
// Routes
// =============================================================
const authRoutes = mustResolve('./routes/auth.routes');
const materialRoutes = mustResolve('./routes/material.routes');
// const studentRoutes = mustResolve('./routes/student.routes');

// =============================================================
// Multer Upload Directory
// =============================================================
const { UPLOAD_DIR } = mustResolve('./middlewares/upload');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log(`📁 Creating UPLOAD_DIR at: ${UPLOAD_DIR}`);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
console.log(`📁 UPLOAD_DIR = ${UPLOAD_DIR}`);

// =============================================================
// App Initialization
// =============================================================
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
console.log('🌐 FRONTEND_ORIGIN:', FRONTEND_ORIGIN);

const app = express();
app.set('trust proxy', 1);

// =============================================================
// CORS
// =============================================================
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization',"x-admin-secret"],
    exposedHeaders: ['Content-Disposition'],
  })
);

// JSON, Cookies, Logging
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// =============================================================
// Static Serving for Local Uploads (not Cloudinary)
// =============================================================
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.pdf') {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    },
  })
);

// =============================================================
// Main Routes
// =============================================================
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
// app.use('/api/student', studentRoutes);

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// =============================================================
// 404
// =============================================================
app.use((req, res, next) => {
  if (res.headersSent) return next();
  return res.status(404).json({ message: 'Route not found' });
});

// =============================================================
// Global Error Handler
// =============================================================
app.use((err, req, res, next) => {
  console.error('🛑 Unhandled error:', err);

  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(413).json({ message: 'File too large' });

  if (err.code === 'INVALID_FILE_TYPE')
    return res.status(415).json({ message: 'Unsupported file type' });

  if (err.name === 'MulterError')
    return res.status(400).json({ message: err.message });

  return res.status(500).json({ message: 'Internal server error' });
});

// =============================================================
// Start Server After DB Connection
// =============================================================
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend Origin: ${FRONTEND_ORIGIN}`);
      console.log(`📁 Upload Directory: ${UPLOAD_DIR}`);
    });
  } catch (err) {
    console.error('💥 Failed to start server:', err);
    process.exit(1);
  }
})();

// ===============================
// index.js (temporary debug-hardened)
// ===============================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

function mustResolve(p) {
  try {
    const abs = require.resolve(p);
    console.log('✅ Resolved:', p, '->', abs);
    return require(p);
  } catch (err) {
    console.error('❌ Cannot resolve:', p);
    throw err;
  }
}

// Resolve early so we see exactly what fails
const connectDB = mustResolve('./config/db');

// Routes/files
const authRoutes = mustResolve('./routes/auth.routes');
// If your real file is ./routes/studyMaterial.routes, switch the line below accordingly:
const materialRoutes = mustResolve('./routes/material.routes');

// Upload dir (make sure folder name matches: middleware vs middlewares)
const { UPLOAD_DIR } = mustResolve('./middlewares/upload');

// Sanity checks
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
  console.error('⚠️ UPLOAD_DIR does not exist, creating:', UPLOAD_DIR);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
console.log('📁 UPLOAD_DIR:', UPLOAD_DIR);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
console.log('🌐 FRONTEND_ORIGIN:', FRONTEND_ORIGIN);

const app = express();
app.set('trust proxy', 1);

// CORS
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  })
);
// Note: preflight requests are handled by the cors middleware above.
// Removing app.options('*', cors()) which can trigger path parsing errors in some setups.

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Static uploads
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.pdf') res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// 404
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ message: 'Route not found' });
});

// Errors
app.use((err, req, res, next) => {
  console.error('🛑 Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'File too large' });
  if (err.code === 'INVALID_FILE_TYPE') return res.status(415).json({ message: 'Unsupported file type' });
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: 'Internal server error' });
});

// Start after DB connects so connection errors don't look like route crashes
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB…');
    await connectDB(); // make sure connectDB returns a Promise; if not, remove await
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`   Frontend: ${FRONTEND_ORIGIN}`);
      console.log(`   Upload dir: ${UPLOAD_DIR}`);
    });
  } catch (err) {
    console.error('💥 Failed to start server. Crash reason:\n', err);
    process.exit(1);
  }
})();

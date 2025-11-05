const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// ✅ Import route files
const authRoutes = require('./routes/auth.routes');
// const curriculumRoutes = require('./routes/curriculum.routes');
// const materialRoutes = require('./routes/studyMaterial.routes');

// Load environment variables
dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend React URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Serve uploaded files (for study materials)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use('/api/auth', authRoutes);
// app.use('/api/curriculum', curriculumRoutes);
// app.use('/api/materials', materialRoutes);

// ✅ Test route
app.get('/', (req, res) => res.json({ ok: true }));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

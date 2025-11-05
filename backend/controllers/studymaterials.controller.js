
// ===============================
// utils/asyncHandler.js
// ===============================

module.exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


// ===============================
// controllers/material.controller.js
// ===============================

const path2 = require('path');
const fs2 = require('fs');
const Material = require('../models/Material');
const { UPLOAD_DIR } = require('../middleware/upload');

function isOwnerOrAdmin(req, material) {
  const isOwner = material.uploadedBy?.toString() === req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  return isOwner || isAdmin;
}

exports.createMaterial = async (req, res) => {
  // Multer has placed file info on req.file
  if (!req.file) return res.status(400).json({ message: 'File is required' });

  const { course, semester, subject, description } = req.body;
  if (!subject) return res.status(400).json({ message: 'Subject is required' });

  const relativePath = path2.relative(process.cwd(), req.file.path).split(path2.sep).join('/');

  const doc = await Material.create({
    course: course || undefined,
    semester: semester || undefined,
    subject,
    description: description || undefined,
    fileUrl: relativePath, // e.g., 'uploads/17000000-file.pdf'
    originalName: req.file.originalname,
    uploadedBy: req.user.id,
  });

  return res.status(201).json({ message: 'Uploaded', data: doc });
};

exports.listMaterials = async (req, res) => {
  const { page = 1, limit = 20, course, semester, subject, q } = req.query;

  const filter = {};
  if (course) filter.course = course;
  if (semester) filter.semester = semester;
  if (subject) filter.subject = subject;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Material.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Material.countDocuments(filter),
  ]);

  return res.json({
    data: items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
};

exports.getMaterial = async (req, res) => {
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });
  return res.json({ data: mat });
};

exports.downloadMaterial = async (req, res) => {
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });

  const absolute = path2.isAbsolute(mat.fileUrl)
    ? mat.fileUrl
    : path2.join(process.cwd(), mat.fileUrl);

  // prevent path traversal by ensuring within UPLOAD_DIR
  const normalized = path2.normalize(absolute);
  if (!normalized.startsWith(UPLOAD_DIR)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (!fs2.existsSync(normalized)) {
    return res.status(410).json({ message: 'File missing from server' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="${encodeURI(mat.originalName)}"`);
  return fs2.createReadStream(normalized).pipe(res);
};

exports.deleteMaterial = async (req, res) => {
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });

  if (!isOwnerOrAdmin(req, mat)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // delete file from disk (best-effort)
  try {
    const absolute = path2.isAbsolute(mat.fileUrl)
      ? mat.fileUrl
      : path2.join(process.cwd(), mat.fileUrl);
    if (absolute.startsWith(UPLOAD_DIR) && fs2.existsSync(absolute)) {
      fs2.unlinkSync(absolute);
    }
  } catch (_) {}

  await mat.deleteOne();
  return res.json({ message: 'Deleted' });
};

exports.updateMaterialMeta = async (req, res) => {
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });
  if (!isOwnerOrAdmin(req, mat)) return res.status(403).json({ message: 'Forbidden' });

  const { course, semester, subject, description } = req.body;
  if (subject !== undefined && !subject) {
    return res.status(400).json({ message: 'Subject cannot be empty' });
  }

  if (course !== undefined) mat.course = course;
  if (semester !== undefined) mat.semester = semester;
  if (subject !== undefined) mat.subject = subject;
  if (description !== undefined) mat.description = description;

  await mat.save();
  return res.json({ message: 'Updated', data: mat });
};


// ===============================
// routes/material.routes.js
// ===============================

const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/material.controller');

// Create/upload
router.post(
  '/',
  requireAuth,
  upload.single('file'), // the form field name must be `file`
  asyncHandler(ctrl.createMaterial)
);

// List with filters
router.get('/', asyncHandler(ctrl.listMaterials));

// Get one
router.get('/:id', asyncHandler(ctrl.getMaterial));

// Download
router.get('/:id/download', asyncHandler(ctrl.downloadMaterial));

// Update meta
router.patch('/:id', requireAuth, asyncHandler(ctrl.updateMaterialMeta));

// Delete (owner or admin)
router.delete('/:id', requireAuth, asyncHandler(ctrl.deleteMaterial));

module.exports = router;


// ===============================
// models/Material.js (for reference – use your provided model)
// ===============================

/*
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  course: String,
  semester: String,
  subject: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// optional for text search
schema.index({ subject: 'text', description: 'text', course: 'text', semester: 'text' });

module.exports = mongoose.model('Material', schema);
*/


// ===============================
// server mounting snippet (example)
// ===============================

/*
const express = require('express');
const app = express();
app.use(express.json());

// static serving of uploads (optional if you want direct viewing)
const path = require('path');
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const materialRoutes = require('./routes/material.routes');
app.use('/api/materials', materialRoutes);

// error handler (must be last)
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large' });
  }
  if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: err.message || 'Unsupported file type' });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
*/

// ===============================
// Notes
// - Send multipart/form-data with a single field named `file`.
// - Optional fields: course, semester, subject (required), description.
// - Protected routes require a Bearer JWT whose payload contains { sub, role }.
// - Download endpoint forces original filename with Content-Disposition.
// - Extend ALLOWED_MIME in middleware/upload.js for more file types.

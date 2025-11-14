// controllers/material.controller.js
const path = require('path');
const fs = require('fs');
const Material = require('../models/Material');

/** Utility: build query + pagination safely */
function buildListParams(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '50', 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.course) filter.course = query.course;
  if (query.q) filter.$text = { $search: String(query.q) };

  return { filter, page, limit, skip };
}

/** POST /api/materials
 *  Expect: Multer sets req.file
 *  Body: { course, semester?, subject, description? }
 */
async function createMaterial(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { course = 'General', semester = '', subject, description = '' } = req.body || {};
    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    // Normalize to a POSIX-style relative path: "uploads/<filename>"
    const relPath = path.posix.join('uploads', req.file.filename);

    const doc = await Material.create({
      course,
      semester,
      subject: subject.trim(),
      description: String(description || ''),
      fileUrl: relPath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('createMaterial error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
}

/** GET /api/materials
 *  Query: q?, course?, page?, limit?
 */
async function listMaterials(req, res) {
  try {
    const { filter, page, limit, skip } = buildListParams(req.query);

    const [items, total] = await Promise.all([
      Material.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Material.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: items,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error('listMaterials error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch materials' });
  }
}

/** GET /api/materials/:id */
async function getMaterialById(req, res) {
  try {
    const item = await Material.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('getMaterialById error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching material' });
  }
}

/** GET /api/materials/:id/download
 *  Sends the file with original filename (Content-Disposition)
 */
async function downloadMaterial(req, res) {
  try {
    const item = await Material.findById(req.params.id);
    if (!item) return res.status(404).send('Not found');

    const absPath = path.join(process.cwd(), item.fileUrl);
    if (!fs.existsSync(absPath)) return res.status(404).send('File not found on disk');

    // Express will set appropriate Content-Disposition header using the provided filename
    return res.download(absPath, item.originalName);
  } catch (err) {
    console.error('downloadMaterial error:', err);
    return res.status(500).send('Error downloading file');
  }
}

/** DELETE /api/materials/:id
 *  Removes DB record; optionally unlinks the file if present.
 */
async function deleteMaterial(req, res) {
  try {
    const item = await Material.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });

    // Optional: remove the file from disk
    const absPath = path.join(process.cwd(), item.fileUrl);
    fs.promises.access(absPath, fs.constants.F_OK)
      .then(() => fs.promises.unlink(absPath).catch(() => {}))
      .catch(() => {});

    return res.json({ success: true });
  } catch (err) {
    console.error('deleteMaterial error:', err);
    return res.status(500).json({ success: false, message: 'Error deleting material' });
  }
}

module.exports = {
  createMaterial,
  listMaterials,
  getMaterialById,
  downloadMaterial,
  deleteMaterial,
};

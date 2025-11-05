
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



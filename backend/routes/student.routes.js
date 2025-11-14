const express = require('express');
const router = express.Router();

const { uploadSingle } = require('../middlewares/upload');
const requireAuth = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/studymaterials.controller');

// Create/upload (authenticated)
router.post(
  '/',
  requireAuth,
  uploadSingle, // client field name must be `file`
  asyncHandler(ctrl.createMaterial)
);

// List (public)
router.get('/', asyncHandler(ctrl.listMaterials));

// Get one
router.get('/:id', asyncHandler(ctrl.getMaterial));

// Download
router.get('/:id/download', asyncHandler(ctrl.downloadMaterial));

// Update meta (owner or admin)
router.patch('/:id', requireAuth, asyncHandler(ctrl.updateMaterialMeta));

// Delete (owner or admin)
router.delete('/:id', requireAuth, asyncHandler(ctrl.deleteMaterial));

module.exports = router;

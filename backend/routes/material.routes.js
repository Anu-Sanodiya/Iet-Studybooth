// const express = require('express');
// const router = express.Router();

// const { uploadSingle } = require('../middlewares/upload');
// const requireAuth = require('../middlewares/auth.middleware');
// const { asyncHandler } = require('../utils/asyncHandler');

// // IMPORTANT — make sure this file name matches exactly:
// const ctrl = require('../controllers/studymaterials.controller');

// router.post(
//   '/',
//   requireAuth,
//   uploadSingle,     // multer middleware
//   asyncHandler(ctrl.createMaterial)
// );


// router.get(
//   '/',
//   asyncHandler(ctrl.listMaterials)
// );


// router.get(
//   '/:id',
//   asyncHandler(ctrl.getMaterial)
// );

// router.get(
//   '/:id/download',
//   asyncHandler(ctrl.downloadMaterial)
// );

// router.patch(
//   '/:id',
//   requireAuth,
//   asyncHandler(ctrl.updateMaterialMeta)
// );


// router.delete(
//   '/:id',
//   requireAuth,
//   asyncHandler(ctrl.deleteMaterial)
// );

// module.exports = router;



const express = require('express');
const router = express.Router();

// 1. FIX: Destructure imports (matches the authMiddleware we just created)
// Check your folder name: is it 'middleware' or 'middlewares'?
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware'); 

const { uploadSingle } = require('../middlewares/upload');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/studymaterials.controller');

// =============================================
// PUBLIC ROUTES (Students can view/download)
// =============================================

router.get(
  '/',
  asyncHandler(ctrl.listMaterials)
);

router.get(
  '/:id',
  asyncHandler(ctrl.getMaterial)
);

router.get(
  '/:id/download',
  asyncHandler(ctrl.downloadMaterial)
);

// =============================================
// ADMIN ONLY ROUTES (Upload/Update/Delete)
// =============================================

router.post(
  '/',
  requireAuth,
  requireAdmin, // <--- CRITICAL: Only Admins can upload
  uploadSingle,    
  asyncHandler(ctrl.createMaterial)
);

router.patch(
  '/:id',
  requireAuth,
  requireAdmin, // <--- CRITICAL
  asyncHandler(ctrl.updateMaterialMeta)
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin, // <--- CRITICAL
  asyncHandler(ctrl.deleteMaterial)
);

module.exports = router;
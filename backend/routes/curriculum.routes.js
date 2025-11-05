const express = require('express');
const router = express.Router();

const currCtrl = require('../controllers/curriculum.controller');
const requireAuth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

// Public listing (students)
router.get('/', currCtrl.list);

// Admin-only create
router.post('/', requireAuth, role('admin'), currCtrl.create);

module.exports = router;

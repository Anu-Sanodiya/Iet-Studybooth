const express = require('express');
const router = express.Router();

const currCtrl = require('../controllers/curriculum.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

// Public listing (students)
router.get('/', currCtrl.list);

// Admin-only create
router.post('/', auth, role('admin'), currCtrl.create);

module.exports = router;

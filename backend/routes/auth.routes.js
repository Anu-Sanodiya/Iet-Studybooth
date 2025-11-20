const express = require('express');
const router = express.Router();

// Import all controllers
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    registerAdmin, 
    loginAdmin 
} = require('../controllers/auth.controller');

// --- Student Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Admin Routes ---
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// --- Common Routes ---
router.post('/logout', logoutUser);

module.exports = router;
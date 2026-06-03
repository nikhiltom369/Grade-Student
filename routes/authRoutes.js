const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Handle Login API
router.post('/login', authController.handleLogin);

// Handle Logout API
router.post('/logout', authController.handleLogout);

// Check Status API
router.get('/status', authController.checkStatus);

module.exports = router;

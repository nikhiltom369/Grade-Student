const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireAuth } = require('../middleware/authMiddleware');

// Apply requireAuth middleware to all student API routes
router.use(requireAuth);

// Handle Add Student Submission API
router.post('/add', studentController.handleAddStudent);

// Get Student List API
router.get('/', studentController.getStudents);

module.exports = router;

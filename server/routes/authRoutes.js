const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, // Added this
    uploadResume 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', register);

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', login);

// @desc    Get current user profile (CRITICAL for staying logged in)
// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @desc    Upload Resume
// @route   PUT /api/auth/profile/resume
router.put('/profile/resume', protect, upload.single('resume'), uploadResume);

module.exports = router;
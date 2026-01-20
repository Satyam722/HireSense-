const express = require('express');
const router = express.Router();
const { 
    applyToJob, 
    getAppliedJobs, 
    withdrawApplication 
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // 1. Import your multer config

// 2. Add upload.single('resume') here
// The string 'resume' MUST match the Key you used in Postman
router.post('/apply', protect, upload.single('resume'), applyToJob);

router.get('/my-applications', protect, getAppliedJobs);
router.delete('/:jobId', protect, withdrawApplication);

module.exports = router;
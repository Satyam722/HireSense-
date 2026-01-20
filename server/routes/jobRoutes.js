const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// 1. Public Routes
router.get('/', jobController.getAllJobs);

// 2. Protected Recruiter Routes
router.post('/', protect, jobController.createJob);
router.get('/my/posted-jobs', protect, jobController.getMyJobs);
router.get('/recruiter/all-applicants', protect, jobController.getAllRecruiterApplicants);
router.get('/:jobId/applicants', protect, jobController.getJobApplicants);

// 3. New Management Routes
router.delete('/:id', protect, jobController.deleteJob);
router.patch('/:jobId/applicants/:applicantId', protect, jobController.updateApplicantStatus);

module.exports = router;
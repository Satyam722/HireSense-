const Job = require('../models/Job');

// @desc    Get all jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, description, salary, requirements } = req.body;
    const job = await Job.create({
      title, company, location,
      jobType: jobType || 'Full-time',
      description, salary, requirements,
      postedBy: req.user._id,
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by recruiter
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a specific job
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants.user', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const formattedApplicants = job.applicants.map(app => ({
      _id: app._id,
      user: app.user,
      aiScore: app.aiScore,
      aiSummary: app.aiSummary,
      status: app.status,
      resumeUrl: app.resumeUrl, 
      appliedAt: app.appliedAt
    }));

    res.status(200).json({
      jobTitle: job.title,
      applicants: formattedApplicants.sort((a, b) => b.aiScore - a.aiScore)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applicants across ALL jobs
exports.getAllRecruiterApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).populate('applicants.user', 'name email');
    let allApplicants = [];
    
    jobs.forEach(job => {
      const flattened = job.applicants.map(app => ({
        _id: app._id,
        aiScore: app.aiScore,
        aiSummary: app.aiSummary, 
        status: app.status,
        user: app.user,
        resumeUrl: app.resumeUrl,
        job: { _id: job._id, title: job.title }
      }));
      allApplicants = [...allApplicants, ...flattened];
    });
    
    allApplicants.sort((a, b) => b.aiScore - a.aiScore);
    res.status(200).json({ applications: allApplicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });
    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update applicant status
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId, applicantId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const applicant = job.applicants.id(applicantId);
    if (!applicant) return res.status(404).json({ success: false, message: "Applicant not found" });

    applicant.status = status;
    await job.save();

    res.status(200).json({ 
      success: true, 
      message: `Status updated to ${status}`,
      updatedStatus: applicant.status 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
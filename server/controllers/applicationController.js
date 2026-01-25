// server/controllers/applicationController.js

const Job = require('../models/Job'); 
const User = require('../models/user');
const pdf = require('pdf-parse'); 
const cloudinary = require('../config/cloudinary');
const { analyzeWithGemini } = require('../services/geminiService');

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId || !req.file) {
        return res.status(400).json({ success: false, message: "Missing required data (Job ID or Resume File)" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Check if user already applied
    const alreadyApplied = job.applicants.some(app => app.user.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "You have already applied for this position." });
    }

    // 1. Text Extraction
    const pdfData = await pdf(req.file.buffer);
    const resumeText = pdfData.text;

    // 2. AI Analysis
    const aiResults = await analyzeWithGemini(job.title, job.description, resumeText);

    if (!aiResults || typeof aiResults.score !== 'number') {
      console.log("🚨 AI Analysis failed to return valid JSON");
      return res.status(500).json({ success: false, message: "AI Analysis failed to generate a score" });
    }

    // 3. Cloudinary Upload (FIXED FOR VIEWING)
    let resumeUrl = "";
    try {
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: "hiresense_resumes", 
              // Using 'auto' allows Cloudinary to recognize it as a PDF/Image 
              // which helps in displaying it in-browser rather than force-download.
              resource_type: "auto", 
              access_mode: "public"
            },
            (err, result) => {
              if (err) return reject(err);
              // Ensure we get the .pdf extension in the URL if it's missing
              let url = result.secure_url;
              if (result.format === 'pdf' && !url.endsWith('.pdf')) {
                url = url.replace(/\/v\d+\//, `$&${result.public_id}.pdf`);
              }
              resolve(url);
            }
          );
          stream.end(req.file.buffer);
        });
      };
      resumeUrl = await uploadStream();
    } catch (uploadError) {
      console.error("Cloudinary Error:", uploadError.message);
      return res.status(500).json({ success: false, message: "Resume upload failed" });
    }

    // 4. Update Database
    job.applicants.push({
      user: req.user.id,
      resumeUrl: resumeUrl, // This is now a viewable https link
      aiScore: aiResults.score,
      aiSummary: aiResults.summary,
      status: "Applied"
    });

    await job.save({ validateBeforeSave: false });
    
    // Update user profile with the latest resume link
    await User.findByIdAndUpdate(req.user.id, { resumeUrl });

    // 5. SUCCESS RESPONSE
    return res.status(200).json({ 
      success: true, 
      score: aiResults.score, 
      summary: aiResults.summary,
      resumeUrl: resumeUrl
    });

  } catch (error) {
    console.error("Final Controller Error:", error.stack);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
  }
};

// Simplified Placeholder functions
const getAppliedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ "applicants.user": req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndUpdate(jobId, {
      $pull: { applicants: { user: req.user.id } }
    });
    res.json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  applyToJob, 
  getAppliedJobs, 
  withdrawApplication 
};
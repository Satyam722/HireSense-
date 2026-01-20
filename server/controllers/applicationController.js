const Job = require('../models/Job');
const User = require('../models/User');
const pdf = require('pdf-parse'); 
const cloudinary = require('../config/cloudinary');
const { analyzeWithGemini } = require('../services/geminiService');

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId || !req.file) {
        return res.status(400).json({ success: false, message: "Missing required data" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // 1. Text Extraction
    const pdfData = await pdf(req.file.buffer);
    const resumeText = pdfData.text;

    // 2. AI Analysis
    const aiResults = await analyzeWithGemini(job.title, job.description, resumeText);

    // CRUCIAL: Check if AI results exist before proceeding
    if (!aiResults || typeof aiResults.score !== 'number') {
      console.log("🚨 AI Analysis returned invalid data");
      return res.status(500).json({ success: false, message: "AI Analysis failed to generate a score" });
    }

    // 3. Cloudinary Upload (Wrapped in try-catch to prevent crashing the whole request)
    let resumeUrl = "";
    try {
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "hiresense", resource_type: "raw" },
            (err, result) => err ? reject(err) : resolve(result.secure_url)
          );
          stream.end(req.file.buffer);
        });
      };
      resumeUrl = await uploadStream();
    } catch (uploadError) {
      console.error("Cloudinary Error:", uploadError.message);
      // We continue even if upload fails so the user sees their score
      resumeUrl = "Pending Upload"; 
    }

    // 4. Update Database
    job.applicants.push({
      user: req.user.id,
      resumeUrl,
      aiScore: aiResults.score,
      aiSummary: aiResults.summary,
      status: "Applied"
    });

    await job.save({ validateBeforeSave: false });
    await User.findByIdAndUpdate(req.user.id, { resumeUrl });

    // 5. SUCCESS RESPONSE
    return res.status(200).json({ 
      success: true, 
      score: aiResults.score, 
      summary: aiResults.summary 
    });

  } catch (error) {
    console.error("Final Controller Error:", error.stack);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
  }
};

module.exports = { applyToJob, getAppliedJobs: async()=>{} , withdrawApplication: async()=>{} }; // Placeholder exports for brevity
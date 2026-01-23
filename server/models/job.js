const mongoose = require('mongoose');

// Schema for individual applications within a job posting
const applicantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  aiScore: {
    type: Number,
    default: 0
  },
  aiSummary: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Main Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String },
  requirements: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [applicantSchema],
  createdAt: { type: Date, default: Date.now }
});

// ✅ FIX: Prevent OverwriteModelError by checking if 'Job' exists
module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
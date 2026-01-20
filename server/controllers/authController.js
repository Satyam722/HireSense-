const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

// Helper function to create JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          resumeUrl: user.resumeUrl // Make sure this is sent
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload & Save Resume URL (FIXED FOR RECRUITER VIEW)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    // Upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "resumes", resource_type: "raw", format: "pdf" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Cloudinary Error", error });

        // Save the actual URL (result.secure_url) to the User model
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { resumeUrl: result.secure_url },
          { new: true }
        );

        // Return the URL clearly
        res.status(200).json({ 
          message: "Resume uploaded successfully!", 
          resumeUrl: user.resumeUrl 
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
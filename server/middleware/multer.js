const multer = require('multer');
const path = require('path');

// Memory storage keeps the file in a buffer (req.file.buffer) 
// for direct transmission to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Standardize extension checking
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      // This error will be caught by your error-handling middleware
      cb(new Error("Only PDF files are allowed for resume uploads!"));
    }
  },
});

module.exports = upload;
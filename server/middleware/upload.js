const multer = require('multer');
const path = require('path');

// Configure memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      cb(new Error("File type is not supported. Please upload a PDF."), false);
      return;
    }
    cb(null, true);
  },
});

module.exports = upload;
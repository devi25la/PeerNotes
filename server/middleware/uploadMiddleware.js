const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedDocExtensions = /\.(pdf|doc|docx|ppt|pptx|png|jpg|jpeg|webp)$/i;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedDocExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type! Allowed formats: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, WEBP'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter
});

// Multer upload fields for resource file and optional thumbnail
const resourceUpload = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

module.exports = {
  upload,
  resourceUpload
};

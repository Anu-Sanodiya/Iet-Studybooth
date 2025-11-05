// middleware/upload.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

// Ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types (extend as needed)
const ALLOWED_MIME = new Set([
  'application/pdf',                                            // .pdf
  'application/vnd.ms-powerpoint',                              // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12', // .pptm
  'application/msword',                                         // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
  'text/plain',                                                 // .txt
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const safeExt = ext.toLowerCase().slice(0, 10); // keep extension short/safe
    const stamp = Date.now();
    const rand = crypto.randomBytes(6).toString('hex');
    cb(null, `${stamp}-${rand}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 1,                   // single file per request
  },
});

module.exports = {
  uploadSingle: upload.single('file'), // client must send field name "file"
  UPLOAD_DIR,
  ALLOWED_MIME,
};


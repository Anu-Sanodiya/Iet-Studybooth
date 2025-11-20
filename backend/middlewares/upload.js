
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed formats
const ALLOWED_FORMATS = ["pdf", "ppt", "pptx", "doc", "docx", "txt"];


const tempFolder = path.join(__dirname, "..", "temp");
if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);
// Expose UPLOAD_DIR for other modules that expect it
const UPLOAD_DIR = tempFolder;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  if (!ALLOWED_FORMATS.includes(ext)) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = {
  uploadSingle: upload.single("file"),
  UPLOAD_DIR,
};

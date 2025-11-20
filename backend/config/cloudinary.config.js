const cloudinary = require('cloudinary').v2;

// Configure from environment variables. If not provided, library will still be exported
// but operations will fail at runtime; this file prevents a MODULE_NOT_FOUND at startup.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET,
  secure: true,
});

module.exports = cloudinary;

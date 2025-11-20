const cloudinary = require('cloudinary').v2;

exports.Cloudinaryconnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log('Cloudinary connected successfully');
    } catch (error) {
        console.error('Cloudinary connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
}
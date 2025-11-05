const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  course: String,
  semester: String,
  subject: { type: String, required: true },
  description: String,
  
  // This will store the path on the server, e.g., 'uploads/17000000-filename.pdf'
  fileUrl: { type: String, required: true }, 
  
  // This stores the user-friendly name, e.g., 'Chapter 1 Notes.pdf'
  // This is CRITICAL for the download logic.
  originalName: { type: String, required: true }, 
  
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', schema);

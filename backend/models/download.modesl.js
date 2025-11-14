// models/Material.js
import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema(
  {
    course: { type: String, default: 'General', index: true },
    semester: { type: String },
    subject: { type: String, required: true, index: true },
    description: { type: String },

    // stored on disk at /uploads/<filename>
    fileUrl: { type: String, required: true }, // e.g., "uploads/1700-file.pdf"
    originalName: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number }
  },
  { timestamps: true }
);

// simple text search across subject/description/originalName
MaterialSchema.index({ subject: 'text', description: 'text', originalName: 'text' });

export default mongoose.model('Material', MaterialSchema);

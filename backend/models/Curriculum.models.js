const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    course: { type: String, required: true },
    semester: { type: String, required: true },
    title: String,
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Curriculum', schema);
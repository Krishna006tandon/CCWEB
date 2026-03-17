const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title:     { type: String, required: true },
  fileURL:   { type: String, required: true },
  issuedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);

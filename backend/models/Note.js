const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileURL: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

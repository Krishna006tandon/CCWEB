const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

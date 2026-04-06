const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  contactName: { type: String, trim: true, required: true },
  contactEmail: { type: String, trim: true, required: true },
  contactPhone: { type: String, trim: true, required: true },
  requestStatus: {
    type: String,
    enum: ['Pending Review', 'Slot Proposed', 'Awaiting Payment', 'Confirmed', 'Cancelled'],
    default: 'Pending Review'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  quotedPrice: { type: Number, default: null },
  adminNotes: { type: String, trim: true, default: '' },
  paymentId: { type: String },
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

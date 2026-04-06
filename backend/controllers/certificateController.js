const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { sendCertificateEmail } = require('../utils/emailService');

// Admin: Upload certificate for a student
exports.uploadCertificate = async (req, res) => {
  try {
    const { studentId, classId, title } = req.body;
    let fileURL = '';

    if (req.file) {
      fileURL = req.file.path || req.file.secure_url || req.file.url;
    } else if (req.body.fileURL) {
      fileURL = req.body.fileURL;
    }

    if (!fileURL) {
      return res.status(400).json({ message: 'Certificate file is required' });
    }

    // Check enrollment exists
    const enrollment = await Enrollment.findOne({ studentId, classId, paymentStatus: 'Completed' });
    if (!enrollment) {
      return res.status(404).json({ message: 'No completed enrollment found for this student and class' });
    }

    const certificate = await Certificate.create({ studentId, classId, title, fileURL });

    // Send certificate email
    try {
      const student = await User.findById(studentId);
      const populated = await certificate.populate('classId', 'title');
      await sendCertificateEmail({
        studentName: student.name,
        studentEmail: student.email,
        className: populated.classId.title,
        certificateURL: fileURL,
        issuedAt: certificate.issuedAt,
      });
    } catch (mailErr) {
      console.error('Certificate email failed (non-critical):', mailErr.message);
    }

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({})
      .populate('studentId', 'name email')
      .populate('classId', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: Get my certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id })
      .populate('classId', 'title chefName image');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

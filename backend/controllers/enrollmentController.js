const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');

exports.createEnrollment = async (req, res) => {
  try {
    const { classId } = req.body;
    const studentId = req.user._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, classId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      classId,
      paymentStatus: 'Pending'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id, paymentStatus: 'Completed' }).populate('classId');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!['Pending', 'Completed', 'Failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    ).populate('studentId', 'name email').populate('classId', 'title price');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({}).populate('studentId', 'name email').populate('classId', 'title price');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

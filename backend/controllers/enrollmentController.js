const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');

exports.createEnrollment = async (req, res) => {
  try {
    const {
      classId,
      contactName,
      contactEmail,
      contactPhone
    } = req.body;
    const studentId = req.user._id;

    if (!classId || !contactName || !contactEmail || !contactPhone) {
      return res.status(400).json({ message: 'Class, name, email and mobile number are required' });
    }

    const selectedClass = await Class.findById(classId);
    if (!selectedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId,
      classId,
      requestStatus: { $ne: 'Cancelled' }
    });
    if (existingEnrollment) {
      existingEnrollment.contactName = contactName;
      existingEnrollment.contactEmail = contactEmail;
      existingEnrollment.contactPhone = contactPhone;
      await existingEnrollment.save();

      return res.status(200).json({
        message: 'Your existing booking request has been updated',
        enrollment: existingEnrollment
      });
    }

    const enrollment = await Enrollment.create({
      studentId,
      classId,
      contactName,
      contactEmail,
      contactPhone,
      requestStatus: 'Pending Review',
      paymentStatus: 'Pending'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('classId')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, requestStatus, quotedPrice, adminNotes } = req.body;

    if (paymentStatus && !['Pending', 'Completed', 'Failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    if (requestStatus && !['Pending Review', 'Slot Proposed', 'Awaiting Payment', 'Confirmed', 'Cancelled'].includes(requestStatus)) {
      return res.status(400).json({ message: 'Invalid request status' });
    }

    const updateData = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (requestStatus) updateData.requestStatus = requestStatus;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice === '' || quotedPrice === null ? null : Number(quotedPrice);

    if (updateData.paymentStatus === 'Completed' && !updateData.requestStatus) {
      updateData.requestStatus = 'Confirmed';
    }

    if (updateData.requestStatus === 'Confirmed' && !updateData.paymentStatus) {
      updateData.paymentStatus = 'Completed';
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      updateData,
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
    const enrollments = await Enrollment.find({})
      .populate('studentId', 'name email')
      .populate('classId', 'title price')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

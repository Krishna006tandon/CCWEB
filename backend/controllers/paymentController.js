const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');
const User = require('../models/User');
const { sendEnrollmentInvoice } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { classId } = req.body;
    const course = await Class.findById(classId);

    if (!course) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET || 
        process.env.RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE' || 
        process.env.RAZORPAY_SECRET === 'your_razorpay_secret_here') {
      return res.status(500).json({ 
        message: 'Payment gateway not configured. Please add Razorpay credentials to environment variables.' 
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: course.price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 10000}`,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { classId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified — create enrollment
      const enrollment = await Enrollment.create({
        studentId: req.user._id,
        classId,
        paymentId: razorpay_payment_id,
        paymentStatus: 'Completed'
      });

      // Send invoice email (non-blocking)
      try {
        const [student, course] = await Promise.all([
          User.findById(req.user._id),
          Class.findById(classId)
        ]);
        await sendEnrollmentInvoice({
          studentName: student.name,
          studentEmail: student.email,
          className: course.title,
          chefName: course.chefName,
          price: course.price,
          paymentId: razorpay_payment_id,
          enrolledAt: enrollment.enrolledAt,
        });
      } catch (mailErr) {
        console.error('Invoice email failed (non-critical):', mailErr.message);
      }

      return res.status(200).json({ message: "Payment verified successfully", enrollment });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


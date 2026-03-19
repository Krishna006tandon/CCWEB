const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');
const User = require('../models/User');
const { sendEnrollmentInvoice } = require('../utils/emailService');
const { createMockRazorpay, createTestRazorpay } = require('../utils/razorpayHelper');

exports.createOrder = async (req, res) => {
  try {
    const { classId } = req.body;
    const course = await Class.findById(classId);

    if (!course) {
      console.log('❌ Class not found:', classId);
      return res.status(404).json({ message: 'Class not found' });
    }

    console.log('📚 Creating order for course:', course.title, 'Price: ₹', course.price);

    // Check if Razorpay credentials are configured
    let razorpay;
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
      console.log('🔧 Using mock Razorpay for development (invalid/missing credentials)');
      razorpay = createMockRazorpay();
    } else {
      // Try to use real Razorpay (live or test), fall back to mock if it fails
      try {
        razorpay = createTestRazorpay();
        console.log('💳 Using real Razorpay with credentials:', process.env.RAZORPAY_KEY.substring(0, 10) + '...');
      } catch (error) {
        console.log('🔧 Razorpay failed, falling back to mock:', error.message);
        razorpay = createMockRazorpay();
      }
    }

    const options = {
      amount: course.price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        classId: classId,
        studentId: req.user._id,
        className: course.title,
        merchant_name: 'Poonam Cooking and Baking Classes',
        merchant_description: `Enrollment for ${course.title}`
      },
      // Mobile UPI specific configurations
      payment_capture: 1,
      // Add mobile-specific options
      method: 'upi', // Default to UPI for mobile
      // Timeout for mobile payments
      expire_by: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes expiry
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      console.log('❌ Failed to create order');
      return res.status(500).send("Some error occurred");
    }

    console.log('✅ Order created successfully:', order.id);
    res.json(order);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { classId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('🔍 Verifying payment:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      classId,
      userAgent: req.get('User-Agent'),
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.get('User-Agent'))
    });

    // For mock payments, skip signature verification
    const isMockPayment = razorpay_order_id && razorpay_order_id.startsWith('order_mock_');
    
    if (!isMockPayment && process.env.RAZORPAY_SECRET) {
      // Real payment verification
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        console.log('❌ Invalid signature detected');
        console.log('❌ Expected:', expectedSign);
        console.log('❌ Received:', razorpay_signature);
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
      console.log('✅ Signature verified successfully');
    } else {
      console.log('🔧 Verifying mock payment or missing secret:', razorpay_order_id);
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      classId,
      paymentId: razorpay_payment_id
    });

    if (existingEnrollment) {
      console.log('⚠️ Enrollment already exists for this payment');
      return res.status(200).json({ message: "Already enrolled", enrollment: existingEnrollment });
    }

    // Payment is verified — create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      classId,
      paymentId: razorpay_payment_id,
      paymentStatus: 'Completed'
    });

    console.log('🎓 Enrollment created:', enrollment._id);

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
      console.log('📧 Invoice email sent to:', student.email);
    } catch (mailErr) {
      console.error('❌ Invoice email failed (non-critical):', mailErr.message);
    }

    return res.status(200).json({ message: "Payment verified successfully", enrollment });
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({ message: error.message });
  }
};


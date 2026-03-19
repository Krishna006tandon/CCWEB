// Email Service Test
const emailService = require('./utils/emailService');

const testEmail = async () => {
  try {
    console.log('📧 Testing email service...');
    
    // Test enrollment email
    await emailService.sendEnrollmentInvoice({
      studentName: 'Test Student',
      studentEmail: 'your_test_email@gmail.com',
      className: 'Italian Cooking Basics',
      chefName: 'Poonam',
      price: '2999',
      paymentId: 'test_payment_123',
      enrolledAt: new Date()
    });
    
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};

// Uncomment to test
// testEmail();

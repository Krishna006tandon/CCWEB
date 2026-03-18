const Razorpay = require('razorpay');

// Mock Razorpay instance for development when credentials are not available
const createMockRazorpay = () => ({
  orders: {
    create: async (options) => {
      console.log('🔧 MOCK PAYMENT: Creating order with options:', options);
      return {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        offer_id: null,
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
      };
    }
  }
});

// Razorpay instance with valid credentials (test or live)
const createTestRazorpay = () => {
  try {
    const keyId = process.env.RAZORPAY_KEY;
    const keySecret = process.env.RAZORPAY_SECRET;
    
    if (!keyId || !keySecret) {
      throw new Error('Missing Razorpay credentials');
    }
    
    console.log(`🔑 Initializing Razorpay with key: ${keyId.substring(0, 10)}... (${keyId.startsWith('rzp_live_') ? 'LIVE' : 'TEST'} mode)`);
    
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.error('Razorpay initialization failed:', error.message);
    return createMockRazorpay();
  }
};

module.exports = { createMockRazorpay, createTestRazorpay };

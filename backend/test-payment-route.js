const mongoose = require('mongoose');
require('dotenv').config();
const CateringOrder = require('./models/CateringOrder');

async function testPaymentRoute() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get a confirmed order for testing
    const order = await CateringOrder.findOne({ status: 'Confirmed' });
    if (!order) {
      console.log('❌ No confirmed order found. Creating test order...');
      
      // Create a test confirmed order
      const testOrder = new CateringOrder({
        customerId: '507f1f77bcf86cd799439011', // Mock user ID
        eventType: 'Test Wedding',
        eventDate: '2026-03-29',
        eventTime: '18:00',
        venue: {
          name: 'Test Venue',
          address: 'Test Address',
          contactNumber: '1234567890'
        },
        guestCount: 20,
        servingStyle: 'Buffet',
        items: [
          {
            name: 'Test Item',
            quantity: 5,
            isCustomItem: true,
            dietary: 'vegetarian'
          }
        ],
        specialRequirements: 'Test requirements',
        orderNumber: `CAT${Date.now()}`,
        status: 'Confirmed',
        pricing: {
          subtotal: 5000,
          serviceCharge: 250,
          totalAmount: 5250,
          advanceAmount: 2625,
          remainingAmount: 2625
        }
      });
      
      await testOrder.save();
      console.log('✅ Test confirmed order created:', testOrder._id.toString());
    }

    // Show all confirmed orders
    const confirmedOrders = await CateringOrder.find({ status: 'Confirmed' });
    console.log('📋 Confirmed Orders:');
    confirmedOrders.forEach(order => {
      console.log(`ID: ${order._id.toString()}, Order: ${order.orderNumber}, Status: ${order.status}`);
      console.log(`Payment URL: http://localhost:5000/api/catering/orders/${order._id}/payment`);
      console.log('---');
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPaymentRoute();

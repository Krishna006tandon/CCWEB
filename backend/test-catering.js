const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const CateringOrder = require('./models/CateringOrder');
const User = require('./models/User');

// Test data
const testOrder = {
  eventType: 'Birthday',
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
      name: 'Custom Paneer Tikka',
      quantity: 5,
      isCustomItem: true,
      dietary: 'vegetarian',
      customizations: {
        spiceLevel: 'Medium',
        specialInstructions: 'Extra spicy please'
      }
    },
    {
      name: 'Custom Dal Makhani',
      quantity: 3,
      isCustomItem: true,
      dietary: 'vegetarian'
    }
  ],
  specialRequirements: 'Test special requirements',
  orderNumber: `CAT${Date.now()}`
};

async function testCateringOrder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a mock user
    const mockUser = {
      _id: '507f1f77bcf86cd799439011', // Mock user ID
      name: 'Test User',
      email: 'test@example.com'
    };

    // Create catering order
    const cateringOrder = new CateringOrder({
      customerId: mockUser._id,
      ...testOrder
    });

    // Calculate total
    cateringOrder.calculateTotal();

    // Add timeline entry
    cateringOrder.timeline.push({
      status: 'Pending',
      timestamp: new Date(),
      notes: 'Order placed successfully'
    });
    cateringOrder.status = 'Pending';

    // Save order
    const savedOrder = await cateringOrder.save();
    console.log('✅ Order saved successfully!');
    console.log('📋 Order details:', {
      orderNumber: savedOrder.orderNumber,
      eventType: savedOrder.eventType,
      itemsCount: savedOrder.items.length,
      customItems: savedOrder.items.filter(item => item.isCustomItem).length,
      pricing: savedOrder.pricing
    });

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run test
testCateringOrder();

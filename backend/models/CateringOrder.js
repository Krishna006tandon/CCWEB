const mongoose = require('mongoose');

const cateringOrderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  eventType: { 
    type: String, 
    enum: ['Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Engagement', 'Other'],
    required: true 
  },
  eventDate: { 
    type: Date, 
    required: true 
  },
  eventTime: { 
    type: String, 
    required: true 
  },
  venue: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String },
    contactNumber: { type: String, required: true }
  },
  guestCount: { 
    type: Number, 
    required: true,
    min: 10
  },
  servingStyle: { 
    type: String, 
    enum: ['Buffet', 'Plated', 'Cocktail', 'Family Style'],
    default: 'Buffet'
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: false 
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: false },
    customizations: {
      spiceLevel: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'] 
      },
      specialInstructions: { type: String }
    },
    isCustomItem: { type: Boolean, default: false },
    dietary: { 
      type: String, 
      enum: ['vegetarian', 'vegan', 'jain'], 
      default: 'vegetarian' 
    }
  }],
  packages: [{
    packageId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'CateringPackage' 
    },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true }
  },
  specialRequirements: {
    dietaryRestrictions: [{ type: String }],
    equipmentNeeded: [{
      type: String,
      enum: ['Tables', 'Chairs', 'Serving Dishes', 'Cutlery', 'Decorations', 'Sound System']
    }],
    staffRequired: { type: Number, default: 0 },
    specialInstructions: { type: String }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparation Started', 'Ready', 'Delivered', 'Completed', 'Cancelled'],
    default: 'Pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Advance Paid', 'Fully Paid', 'Refunded'],
    default: 'Pending' 
  },
  paymentDetails: {
    advancePaymentId: { type: String },
    fullPaymentId: { type: String },
    advancePaidAt: { type: Date },
    fullPaidAt: { type: Date }
  },
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  cancellationReason: { type: String },
  cancelledAt: { type: Date }
}, { timestamps: true });

// Calculate total amount
cateringOrderSchema.methods.calculateTotal = function() {
  let subtotal = 0;
  
  // Calculate items total
  this.items.forEach(item => {
    if (item.price && !isNaN(item.price)) {
      subtotal += item.price * item.quantity;
    }
  });
  
  // Calculate packages total
  this.packages.forEach(pkg => {
    if (pkg.price && !isNaN(pkg.price)) {
      subtotal += pkg.price * pkg.quantity;
    }
  });
  
  const serviceCharge = subtotal * 0.05; // 5% service charge
  const total = subtotal + serviceCharge;
  const advance = total * 0.50; // 50% advance
  
  this.pricing = {
    subtotal,
    serviceCharge,
    totalAmount: total,
    advanceAmount: advance,
    remainingAmount: total - advance
  };
  
  return this.pricing;
};

// Add timeline entry
cateringOrderSchema.methods.addTimelineEntry = function(status, notes = '') {
  this.timeline.push({
    status,
    timestamp: new Date(),
    notes
  });
  this.status = status;
  return this.save();
};

module.exports = mongoose.model('CateringOrder', cateringOrderSchema);

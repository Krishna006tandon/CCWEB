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
      required: true 
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customizations: {
      spiceLevel: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'] 
      },
      specialInstructions: { type: String }
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

// Generate order number before saving
cateringOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `CAT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate total amount
cateringOrderSchema.methods.calculateTotal = function() {
  let subtotal = 0;
  
  // Calculate items total
  this.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Calculate packages total
  this.packages.forEach(pkg => {
    subtotal += pkg.price * pkg.quantity;
  });
  
  const serviceCharge = subtotal * 0.10; // 10% service charge
  const tax = (subtotal + serviceCharge) * 0.18; // 18% GST
  const total = subtotal + serviceCharge + tax;
  const advance = total * 0.50; // 50% advance
  
  this.pricing = {
    subtotal,
    serviceCharge,
    tax,
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

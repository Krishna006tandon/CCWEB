const mongoose = require('mongoose');

const cateringPackageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  packageType: { 
    type: String, 
    enum: ['Silver', 'Gold', 'Platinum', 'Custom'],
    required: true 
  },
  pricePerPerson: { 
    type: Number, 
    required: true 
  },
  minGuests: { 
    type: Number, 
    required: true,
    default: 20
  },
  maxGuests: { 
    type: Number, 
    required: true,
    default: 500
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true }, // per person
    unit: { 
      type: String, 
      enum: ['Pieces', 'Plates', 'Bowls', 'Glasses', 'Servings'],
      default: 'Plates'
    }
  }],
  inclusions: [{
    type: String,
    enum: [
      'Appetizers',
      'Main Course',
      'Desserts',
      'Beverages',
      'Service Staff',
      'Tables & Chairs',
      'Decorations',
      'Cutlery & Crockery',
      'Cleaning Service',
      'Transportation'
    ]
  }],
  dietaryOptions: [{
    type: String,
    enum: ['Veg', 'Non-veg', 'Jain', 'Vegan', 'Gluten-free']
  }],
  servingStyle: { 
    type: String, 
    enum: ['Buffet', 'Plated', 'Cocktail', 'Family Style'],
    default: 'Buffet'
  },
  preparationTime: { 
    type: Number, 
    required: true 
  }, // hours
  advanceNoticeHours: { 
    type: Number, 
    required: true,
    default: 48
  },
  isPopular: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  customizations: {
    canModifyItems: { type: Boolean, default: false },
    canAddItems: { type: Boolean, default: false },
    maxCustomItems: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Calculate total price for given guest count
cateringPackageSchema.methods.calculatePrice = function(guestCount) {
  if (guestCount < this.minGuests) {
    throw new Error(`Minimum ${this.minGuests} guests required for this package`);
  }
  if (guestCount > this.maxGuests) {
    throw new Error(`Maximum ${this.maxGuests} guests allowed for this package`);
  }
  
  return this.pricePerPerson * guestCount;
};

// Get package summary
cateringPackageSchema.methods.getSummary = function() {
  return {
    name: this.name,
    packageType: this.packageType,
    pricePerPerson: this.pricePerPerson,
    minGuests: this.minGuests,
    maxGuests: this.maxGuests,
    servingStyle: this.servingStyle,
    itemCount: this.items.length,
    inclusions: this.inclusions.length,
    dietaryOptions: this.dietaryOptions
  };
};

module.exports = mongoose.model('CateringPackage', cateringPackageSchema);

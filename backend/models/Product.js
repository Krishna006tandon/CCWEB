const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { 
    type: String, 
    enum: ['Veg', 'Non-veg', 'Chinese', 'Italian', 'Continental', 'Dessert', 'Beverage'],
    required: true 
  },
  cookingTime: { type: Number, required: true }, // in minutes
  servingSize: { type: Number, required: true }, // number of people it serves
  spiceLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  ingredients: [{ type: String }],
  allergens: [{ type: String }],
  dietaryInfo: [{ 
    type: String, 
    enum: ['Gluten-free', 'Vegan', 'Jain', 'Dairy-free', 'Nut-free'] 
  }],
  isCateringItem: { type: Boolean, default: false },
  minOrderQuantity: { type: Number, default: 1 },
  preparationTime: { type: Number }, // hours for catering
  requiresAdvance: { type: Boolean, default: false },
  advanceNoticeHours: { type: Number, default: 24 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

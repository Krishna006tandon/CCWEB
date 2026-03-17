const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  chefName: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);

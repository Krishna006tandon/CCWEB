const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('./models/Class');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const classes = [
  {
    title: 'Italian Pasta Mastery',
    description: 'Learn to make fresh pasta from scratch with authentic Italian techniques.',
    price: 49,
    duration: '3 hours',
    chefName: 'Chef Giovanni',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800'
  },
  {
    title: 'Baking Essentials',
    description: 'Master the art of bread making, from sourdough to brioche.',
    price: 35,
    duration: '4 hours',
    chefName: 'Chef Elena',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
  },
  {
    title: 'Sushi Rolling Workshop',
    description: 'Perfect your sushi rice and learn various rolling techniques.',
    price: 55,
    duration: '2.5 hours',
    chefName: 'Chef Tanaka',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800'
  }
];

const products = [
  {
    name: 'Chef Knife - 8 Inch',
    description: 'High-carbon stainless steel professional chef knife.',
    price: 120,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400'
  },
  {
    name: 'Cast Iron Skillet',
    description: 'Pre-seasoned 12-inch cast iron skillet for perfect searing.',
    price: 85,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1565452344518-47fca9da4591?w=400'
  },
  {
    name: 'Copper Mixing Bowls',
    description: 'Set of 3 elegant copper-plated mixing bowls.',
    price: 65,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1581442116010-02e077583765?w=400'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    await Class.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    await Class.insertMany(classes);
    await Product.insertMany(products);

    // Seed Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@cookery.com',
      password: 'admin123',
      role: 'admin'
    });

    // Seed Student
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'student'
    });
    
    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

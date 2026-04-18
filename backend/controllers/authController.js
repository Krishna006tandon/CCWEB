const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    console.log(`Login attempt for: "${email}"`);
    console.log(`Searching in collection: ${User.collection.name}`);
    console.log(`Database connection state: ${mongoose.connection.readyState}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: "${email}" in ${mongoose.connection.db?.databaseName || 'unknown db'}`);
    }

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CateringOrder = require('../models/CateringOrder');
const CateringPackage = require('../models/CateringPackage');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendCateringConfirmation, sendCateringUpdate } = require('../utils/emailService');

let razorpay;
if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
} else {
  console.warn('Razorpay credentials not found in environment variables');
}

// Get all catering packages
exports.getCateringPackages = async (req, res) => {
  try {
    const packages = await CateringPackage.find({ isActive: true })
      .populate('items.productId', 'name image price category')
      .sort({ pricePerPerson: 1 });
    
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single catering package
exports.getCateringPackageById = async (req, res) => {
  try {
    const package = await CateringPackage.findById(req.params.id)
      .populate('items.productId', 'name image price category ingredients dietaryInfo');
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get catering products (items marked for catering)
exports.getCateringProducts = async (req, res) => {
  try {
    const { category, dietary } = req.query;
    
    let query = { isCateringItem: true };
    
    if (category) {
      query.category = category;
    }
    
    if (dietary) {
      query.dietaryInfo = { $in: [dietary] };
    }
    
    const products = await Product.find(query)
      .sort({ name: 1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create catering order
exports.createCateringOrder = async (req, res) => {
  try {
    const {
      eventType,
      eventDate,
      eventTime,
      venue,
      guestCount,
      servingStyle,
      items,
      packages,
      specialRequirements
    } = req.body;

    // Check if event date is at least 24 hours in advance
    const eventDateTime = new Date(`${eventDate} ${eventTime}`);
    const now = new Date();
    const hoursDiff = (eventDateTime - now) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      return res.status(400).json({ 
        message: 'Catering orders must be placed at least 24 hours in advance' 
      });
    }

    // Validate items and get current prices
    let orderItems = [];
    if (items && items.length > 0) {
      for (let item of items) {
        const product = await Product.findById(item.productId);
        if (!product || !product.isCateringItem) {
          return res.status(400).json({ message: `Invalid catering item: ${item.name}` });
        }
        
        orderItems.push({
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          customizations: item.customizations || {}
        });
      }
    }

    // Validate packages and get current prices
    let orderPackages = [];
    if (packages && packages.length > 0) {
      for (let pkg of packages) {
        const package = await CateringPackage.findById(pkg.packageId);
        if (!package || !package.isActive) {
          return res.status(400).json({ message: `Invalid package: ${pkg.name}` });
        }
        
        // Check guest count constraints
        if (guestCount < package.minGuests || guestCount > package.maxGuests) {
          return res.status(400).json({ 
            message: `Package ${package.name} requires ${package.minGuests}-${package.maxGuests} guests` 
          });
        }
        
        orderPackages.push({
          packageId: package._id,
          name: package.name,
          quantity: pkg.quantity || 1,
          price: package.calculatePrice(guestCount)
        });
      }
    }

    // Create catering order
    const cateringOrder = new CateringOrder({
      customerId: req.user._id,
      eventType,
      eventDate,
      eventTime,
      venue,
      guestCount,
      servingStyle,
      items: orderItems,
      packages: orderPackages,
      specialRequirements
    });

    // Calculate total
    cateringOrder.calculateTotal();

    // Add initial timeline entry
    cateringOrder.addTimelineEntry('Pending', 'Order placed successfully');

    await cateringOrder.save();

    // Send confirmation email
    await sendCateringConfirmation(cateringOrder);

    res.status(201).json(cateringOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create advance payment order
exports.createCateringPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ message: 'Payment service not available' });
    }

    const { orderId } = req.params;
    
    const cateringOrder = await CateringOrder.findById(orderId)
      .populate('customerId', 'name email');
    
    if (!cateringOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (cateringOrder.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (cateringOrder.paymentStatus !== 'Pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    const options = {
      amount: cateringOrder.pricing.advanceAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `catering_${cateringOrder.orderNumber}`,
      notes: {
        orderId: cateringOrder._id.toString(),
        type: 'catering_advance'
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      cateringOrderId: cateringOrder._id,
      advanceAmount: cateringOrder.pricing.advanceAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify advance payment
exports.verifyCateringPayment = async (req, res) => {
  try {
    if (!razorpay || !process.env.RAZORPAY_SECRET) {
      return res.status(503).json({ message: 'Payment service not available' });
    }

    const { orderId, paymentId, signature } = req.body;
    const { cateringOrderId } = req.params;

    const cateringOrder = await CateringOrder.findById(cateringOrderId);
    
    if (!cateringOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order
    cateringOrder.paymentStatus = 'Advance Paid';
    cateringOrder.paymentDetails.advancePaymentId = paymentId;
    cateringOrder.paymentDetails.advancePaidAt = new Date();
    cateringOrder.status = 'Confirmed';
    
    cateringOrder.addTimelineEntry('Confirmed', 'Advance payment received');

    await cateringOrder.save();

    // Send confirmation email
    await sendCateringUpdate(cateringOrder, 'payment_confirmed');

    res.json({ 
      message: 'Payment verified successfully',
      order: cateringOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's catering orders
exports.getUserCateringOrders = async (req, res) => {
  try {
    const orders = await CateringOrder.find({ customerId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single catering order
exports.getCateringOrderById = async (req, res) => {
  try {
    const order = await CateringOrder.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name image category')
      .populate('packages.packageId', 'name description');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.customerId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateCateringOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await CateringOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.addTimelineEntry(status, notes || `Status updated to ${status}`);
    await order.save();

    // Send update email
    await sendCateringUpdate(order, 'status_update');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel catering order
exports.cancelCateringOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await CateringOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if cancellation is allowed (only before preparation starts)
    if (order.status === 'Preparation Started' || order.status === 'Ready') {
      return res.status(400).json({ 
        message: 'Cannot cancel order after preparation has started' 
      });
    }

    order.status = 'Cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    
    order.addTimelineEntry('Cancelled', reason);

    // Handle refund if advance was paid
    if (order.paymentStatus === 'Advance Paid') {
      order.paymentStatus = 'Refunded';
      // TODO: Initiate Razorpay refund
    }

    await order.save();

    // Send cancellation email
    await sendCateringUpdate(order, 'cancelled');

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

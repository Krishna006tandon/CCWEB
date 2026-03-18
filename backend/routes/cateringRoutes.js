const express = require('express');
const router = express.Router();
const {
  getCateringPackages,
  getCateringPackageById,
  getCateringProducts,
  createCateringOrder,
  createCateringPayment,
  verifyCateringPayment,
  getUserCateringOrders,
  getCateringOrderById,
  updateCateringOrderStatus,
  cancelCateringOrder
} = require('../controllers/cateringController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, cateringPackageSchema, cateringOrderSchema } = require('../middleware/validationMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/packages', getCateringPackages);
router.get('/packages/:id', getCateringPackageById);
router.get('/products', getCateringProducts);

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Order management
router.post('/orders', validate(cateringOrderSchema), createCateringOrder);
router.get('/orders/my', getUserCateringOrders);
router.get('/orders/:id', getCateringOrderById);
router.post('/orders/:id/payment', createCateringPayment);
router.post('/orders/:id/payment/verify', verifyCateringPayment);
router.put('/orders/:id/cancel', cancelCateringOrder);

// Admin only routes
router.use((req, res, next) => admin(req, res, next)); // All routes below require admin access

// Package management
router.post('/packages', 
  upload.single('image'), 
  validate(cateringPackageSchema), 
  async (req, res) => {
    const CateringPackage = require('../models/CateringPackage');
    try {
      const packageData = { ...req.body };
      if (req.file) {
        packageData.image = req.file.path;
      }
      const package = new CateringPackage(packageData);
      await package.save();
      res.status(201).json(package);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put('/packages/:id', 
  upload.single('image'), 
  validate(cateringPackageSchema), 
  async (req, res) => {
    const CateringPackage = require('../models/CateringPackage');
    try {
      const packageData = { ...req.body };
      if (req.file) {
        packageData.image = req.file.path;
      }
      const package = await CateringPackage.findByIdAndUpdate(
        req.params.id, 
        packageData, 
        { new: true, runValidators: true }
      );
      if (!package) {
        return res.status(404).json({ message: 'Package not found' });
      }
      res.json(package);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/packages/:id', async (req, res) => {
  const CateringPackage = require('../models/CateringPackage');
  try {
    const package = await CateringPackage.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order management (admin)
router.get('/orders', async (req, res) => {
  const CateringOrder = require('../models/CateringOrder');
  try {
    const orders = await CateringOrder.find({})
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', updateCateringOrderStatus);

module.exports = router;

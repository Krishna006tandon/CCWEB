const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, productSchema } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), validate(productSchema), createProduct);

router.route('/:id')
  .put(protect, admin, upload.single('image'), validate(productSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;

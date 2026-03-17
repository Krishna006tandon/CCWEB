const express = require('express');
const router = express.Router();
const { createClass, getClasses, updateClass, deleteClass } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, classSchema } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getClasses)
  .post(protect, admin, upload.single('image'), validate(classSchema), createClass);

router.route('/:id')
  .put(protect, admin, upload.single('image'), validate(classSchema), updateClass)
  .delete(protect, admin, deleteClass);

module.exports = router;

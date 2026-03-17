const express = require('express');
const router = express.Router();
const { uploadNote, getNotesByClass } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .post(protect, admin, upload.single('file'), uploadNote);

router.route('/:classId')
  .get(protect, getNotesByClass);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  uploadCertificate,
  getAllCertificates,
  getMyCertificates,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

// Student: get my certificates
router.get('/my', protect, getMyCertificates);

// Admin: get all certificates
router.get('/', protect, admin, getAllCertificates);

// Admin: upload certificate for a student
router.post('/', protect, admin, upload.single('file'), uploadCertificate);

// Admin: delete certificate
router.delete('/:id', protect, admin, deleteCertificate);

module.exports = router;

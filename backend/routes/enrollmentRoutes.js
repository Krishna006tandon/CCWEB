const express = require('express');
const router = express.Router();
const { createEnrollment, getStudentEnrollments, getAllEnrollments, updateEnrollmentStatus } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createEnrollment);
router.get('/my', protect, getStudentEnrollments);
router.get('/', protect, admin, getAllEnrollments);
router.put('/:id', protect, admin, updateEnrollmentStatus);

module.exports = router;

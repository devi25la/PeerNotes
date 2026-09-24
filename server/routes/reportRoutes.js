const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  updateReportStatus
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, createReport);
router.get('/', protect, authorizeRoles('admin'), getReports);
router.put('/:id', protect, authorizeRoles('admin'), updateReportStatus);

module.exports = router;

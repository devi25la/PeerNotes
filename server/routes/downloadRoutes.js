const express = require('express');
const router = express.Router();
const {
  downloadResource,
  getUserDownloadHistory
} = require('../controllers/downloadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history', protect, getUserDownloadHistory);
router.post('/:resourceId', protect, downloadResource);

module.exports = router;

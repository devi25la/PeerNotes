const express = require('express');
const router = express.Router();
const {
  addOrUpdateReview,
  getResourceReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:resourceId', getResourceReviews);
router.post('/:resourceId', protect, addOrUpdateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

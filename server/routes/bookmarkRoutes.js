const express = require('express');
const router = express.Router();
const {
  toggleBookmark,
  getUserBookmarks
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserBookmarks);
router.post('/:resourceId', protect, toggleBookmark);

module.exports = router;

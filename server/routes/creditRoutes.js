const express = require('express');
const router = express.Router();
const {
  getMyCreditTransactions
} = require('../controllers/creditController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history', protect, getMyCreditTransactions);

module.exports = router;

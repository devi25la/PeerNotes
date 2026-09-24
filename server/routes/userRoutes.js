const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getLeaderboard
} = require('../controllers/userController');

router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserProfile);

module.exports = router;

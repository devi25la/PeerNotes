const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  approveResource,
  rejectResource,
  getAllUsers,
  toggleUserStatus,
  adminAdjustCredits,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes here require Admin role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.put('/resources/:id/approve', approveResource);
router.put('/resources/:id/reject', rejectResource);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/users/:id/credits', adminAdjustCredits);
router.delete('/users/:id', deleteUser);

module.exports = router;

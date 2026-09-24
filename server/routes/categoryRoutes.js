const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(getCategories)
  .post(protect, authorizeRoles('admin'), createCategory);

router
  .route('/:id')
  .put(protect, authorizeRoles('admin'), updateCategory)
  .delete(protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;

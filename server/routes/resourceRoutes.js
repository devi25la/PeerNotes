const express = require('express');
const router = express.Router();
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getMyResources,
  getFeaturedSummary
} = require('../controllers/resourceController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { resourceUpload } = require('../middleware/uploadMiddleware');

router.get('/featured-summary', getFeaturedSummary);
router.get('/my-uploads', protect, getMyResources);

router
  .route('/')
  .get(optionalAuth, getResources)
  .post(protect, resourceUpload, createResource);

router
  .route('/:id')
  .get(optionalAuth, getResourceById)
  .put(protect, updateResource)
  .delete(protect, deleteResource);

module.exports = router;

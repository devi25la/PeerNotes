const Review = require('../models/Review');
const Resource = require('../models/Resource');
const { adjustCredits } = require('../utils/creditManager');

// @desc    Add or update a rating & review for a resource
// @route   POST /api/reviews/:resourceId
// @access  Private
const addOrUpdateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const resourceId = req.params.resourceId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number between 1 and 5'
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user already reviewed this resource
    let review = await Review.findOne({
      resource: resourceId,
      user: req.user._id
    });

    let isNewReview = false;
    if (review) {
      review.rating = Number(rating);
      review.comment = comment ? comment.trim() : review.comment;
      await review.save();
    } else {
      review = await Review.create({
        resource: resourceId,
        user: req.user._id,
        rating: Number(rating),
        comment: comment ? comment.trim() : 'Helpful resource!'
      });
      isNewReview = true;
    }

    // Recalculate average rating
    await Review.calcAverageRating(resourceId);

    // Check positive ratings milestone (+3 credits for author when 5 positive ratings reached)
    if (isNewReview && rating >= 4 && resource.uploadedBy.toString() !== req.user._id.toString()) {
      const positiveCount = await Review.countDocuments({
        resource: resourceId,
        rating: { $gte: 4 }
      });
      if (positiveCount === 5) {
        try {
          await adjustCredits(
            resource.uploadedBy,
            3,
            'rating_bonus',
            `⭐ Rating Milestone (+3 credits): 5 positive reviews on "${resource.title}"!`,
            resource._id
          );
        } catch (err) {
          console.error('Rating milestone bonus error:', err.message);
        }
      }
    }

    const updatedResource = await Resource.findById(resourceId);
    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name profileImage college department'
    );

    res.status(200).json({
      success: true,
      message: isNewReview ? 'Review submitted successfully' : 'Review updated successfully',
      data: populatedReview,
      averageRating: updatedResource.averageRating,
      ratingCount: updatedResource.ratingCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a resource
// @route   GET /api/reviews/:resourceId
// @access  Public
const getResourceReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ resource: req.params.resourceId });
    const reviews = await Review.find({ resource: req.params.resourceId })
      .populate('user', 'name profileImage college department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Author or Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const isAuthor = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const resourceId = review.resource;
    await review.deleteOne();

    await Review.calcAverageRating(resourceId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrUpdateReview,
  getResourceReviews,
  deleteReview
};

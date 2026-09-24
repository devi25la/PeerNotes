const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating from 1 to 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate reviews from the same student for the same resource
reviewSchema.index({ resource: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating & review count for a resource
reviewSchema.statics.calcAverageRating = async function (resourceId) {
  const stats = await this.aggregate([
    {
      $match: { resource: new mongoose.Types.ObjectId(resourceId) }
    },
    {
      $group: {
        _id: '$resource',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Resource').findByIdAndUpdate(resourceId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        ratingCount: stats[0].nRating,
        reviewCount: stats[0].nRating
      });
    } else {
      await mongoose.model('Resource').findByIdAndUpdate(resourceId, {
        averageRating: 0,
        ratingCount: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error('Error updating average rating:', err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.resource);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.calcAverageRating(doc.resource);
  }
});

module.exports = mongoose.model('Review', reviewSchema);

const User = require('../models/User');
const Resource = require('../models/Resource');

// @desc    Get student public profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name college department semester bio profileImage credits createdAt'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const approvedResources = await Resource.find({
      uploadedBy: user._id,
      status: 'approved'
    }).sort({ downloads: -1, createdAt: -1 });

    const totalDownloads = approvedResources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const averageRatingAgg = await Resource.aggregate([
      { $match: { uploadedBy: user._id, status: 'approved', ratingCount: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$averageRating' } } }
    ]);
    const overallAvgRating = averageRatingAgg.length > 0 ? Math.round(averageRatingAgg[0].avg * 10) / 10 : 0;

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          totalUploads: approvedResources.length,
          totalDownloads,
          overallAvgRating
        },
        resources: approvedResources
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top contributors leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const topStudents = await User.find({ role: 'student', isActive: true })
      .select('name college department semester profileImage credits')
      .sort({ credits: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: topStudents.length,
      data: topStudents
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getLeaderboard
};

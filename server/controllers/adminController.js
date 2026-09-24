const User = require('../models/User');
const Resource = require('../models/Resource');
const Report = require('../models/Report');
const Category = require('../models/Category');
const Download = require('../models/Download');
const Review = require('../models/Review');
const CreditTransaction = require('../models/CreditTransaction');
const { adjustCredits } = require('../utils/creditManager');

// @desc    Get comprehensive admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalResources = await Resource.countDocuments();
    const pendingResources = await Resource.countDocuments({ status: 'pending' });
    const approvedResources = await Resource.countDocuments({ status: 'approved' });
    const rejectedResources = await Resource.countDocuments({ status: 'rejected' });
    const totalDownloads = await Download.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalReports = await Report.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Top contributors by uploads and credits
    const topContributors = await User.find({ role: 'student' })
      .select('name email college department credits createdAt profileImage')
      .sort({ credits: -1 })
      .limit(6);

    // Recent 6 pending resources for quick review
    const recentPending = await Resource.find({ status: 'pending' })
      .populate('uploadedBy', 'name email college')
      .sort({ createdAt: -1 })
      .limit(6);

    // Category distribution
    const categoryDistribution = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Resource status distribution
    const statusDistribution = [
      { name: 'Approved', value: approvedResources, color: '#22c55e' },
      { name: 'Pending', value: pendingResources, color: '#eab308' },
      { name: 'Rejected', value: rejectedResources, color: '#ef4444' }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalAdmins,
        totalResources,
        pendingResources,
        approvedResources,
        rejectedResources,
        totalDownloads,
        pendingReports,
        totalReports,
        totalCategories,
        totalReviews
      },
      topContributors,
      recentPending,
      categoryDistribution,
      statusDistribution
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a pending resource (+10 credits to student uploader)
// @route   PUT /api/admin/resources/:id/approve
// @access  Private (Admin)
const approveResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const wasPending = resource.status === 'pending' || resource.status === 'rejected';
    resource.status = 'approved';
    resource.rejectionReason = '';
    await resource.save();

    // Award +10 credits to student if newly approved
    if (wasPending) {
      try {
        await adjustCredits(
          resource.uploadedBy,
          10,
          'upload_reward',
          `🎉 Resource Approved (+10 credits): "${resource.title}"`,
          resource._id
        );
      } catch (err) {
        console.error('Credit reward error during approval:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resource approved and +10 credits awarded to the author!',
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending resource with reason
// @route   PUT /api/admin/resources/:id/reject
// @access  Private (Admin)
const rejectResource = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a clear reason for rejecting this resource'
      });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.status = 'rejected';
    resource.rejectionReason = rejectionReason.trim();
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource rejected and feedback saved for student.',
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and role filtering (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;
    const { search, role, status } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: { $regex: regex } }, { email: { $regex: regex } }, { college: { $regex: regex } }];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Attach upload count and downloads received for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const uploadsCount = await Resource.countDocuments({ uploadedBy: u._id });
        const approvedCount = await Resource.countDocuments({ uploadedBy: u._id, status: 'approved' });
        return {
          ...u.toObject(),
          uploadsCount,
          approvedCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (Activate / Deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust user credits manually (Admin only)
// @route   POST /api/admin/users/:id/credits
// @access  Private (Admin)
const adminAdjustCredits = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid credit amount'
      });
    }

    const { user, transaction } = await adjustCredits(
      req.params.id,
      Number(amount),
      'admin_adjustment',
      `Admin Adjustment: ${reason || 'Manual modification by admin'}`
    );

    res.status(200).json({
      success: true,
      message: `User credits updated. New balance: ${user.credits}`,
      data: {
        credits: user.credits,
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  approveResource,
  rejectResource,
  getAllUsers,
  toggleUserStatus,
  adminAdjustCredits,
  deleteUser
};

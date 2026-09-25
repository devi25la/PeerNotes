const Resource = require('../models/Resource');
const Download = require('../models/Download');
const User = require('../models/User');
const { adjustCredits } = require('../utils/creditManager');
const path = require('path');
const fs = require('fs');

// @desc    Download a resource (deduct 1 credit, record download, check uploader milestone)
// @route   POST /api/downloads/:resourceId
// @access  Private
const downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.status !== 'approved' && req.user.role !== 'admin' && req.user._id.toString() !== resource.uploadedBy.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This resource is not available for download'
      });
    }

    const isUploader = req.user._id.toString() === resource.uploadedBy.toString();
    const isAdmin = req.user.role === 'admin';

    // If user is uploader or admin, no credit charge; otherwise charge 1 credit
    if (!isUploader && !isAdmin) {
      const user = await User.findById(req.user._id);
      if (user.credits < 1) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient credits! You need at least 1 credit to download. Share notes to earn credits!'
        });
      }

      // Deduct 1 credit
      await adjustCredits(
        req.user._id,
        -1,
        'download_cost',
        `📥 Resource Download: "${resource.title}"`,
        resource._id
      );
    }

    // Increment download count on resource
    resource.downloads += 1;
    await resource.save();

    // Check if uploader reached 10 downloads milestone (and every 10 downloads)
    if (resource.downloads % 10 === 0 && !isUploader) {
      try {
        await adjustCredits(
          resource.uploadedBy,
          5,
          'download_milestone',
          `🎯 Milestone Reached (+5 credits): "${resource.title}" reached ${resource.downloads} downloads!`,
          resource._id
        );
      } catch (err) {
        console.error('Milestone credit reward error:', err.message);
      }
    }

    // Record download entry
    await Download.create({
      resource: resource._id,
      user: req.user._id,
      creditCharged: isUploader || isAdmin ? 0 : 1
    });

    // Refresh user's updated credits
    const updatedUser = await User.findById(req.user._id);

    // Generate absolute file URL for cross-origin client downloads
    let resolvedFileUrl = resource.fileUrl;
    if (resolvedFileUrl && resolvedFileUrl.startsWith('/')) {
      const serverOrigin = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
      resolvedFileUrl = `${serverOrigin}${resolvedFileUrl}`;
    }

    res.status(200).json({
      success: true,
      message: 'Download initiated successfully',
      fileUrl: resolvedFileUrl,
      fileName: resource.originalFileName || `${resource.title}.pdf`,
      currentCredits: updatedUser.credits,
      downloadsCount: resource.downloads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's download history
// @route   GET /api/downloads/history
// @access  Private
const getUserDownloadHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const total = await Download.countDocuments({ user: req.user._id });
    const downloads = await Download.find({ user: req.user._id })
      .populate({
        path: 'resource',
        select: 'title subject category resourceType fileUrl averageRating uploadedBy',
        populate: {
          path: 'uploadedBy',
          select: 'name profileImage college'
        }
      })
      .sort({ downloadedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out downloads where resource might have been deleted
    const validDownloads = downloads.filter((d) => d.resource !== null);

    res.status(200).json({
      success: true,
      count: validDownloads.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: validDownloads
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadResource,
  getUserDownloadHistory
};

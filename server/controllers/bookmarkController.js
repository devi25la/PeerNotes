const Bookmark = require('../models/Bookmark');
const Resource = require('../models/Resource');

// @desc    Toggle bookmark on a resource (add or remove)
// @route   POST /api/bookmarks/:resourceId
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const resourceId = req.params.resourceId;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const existingBookmark = await Bookmark.findOne({
      resource: resourceId,
      user: req.user._id
    });

    let isBookmarked = false;
    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.deleteOne();
      resource.bookmarks = Math.max(0, (resource.bookmarks || 1) - 1);
      await resource.save();
      isBookmarked = false;
    } else {
      // Create bookmark
      await Bookmark.create({
        resource: resourceId,
        user: req.user._id
      });
      resource.bookmarks = (resource.bookmarks || 0) + 1;
      await resource.save();
      isBookmarked = true;
    }

    res.status(200).json({
      success: true,
      message: isBookmarked ? 'Resource bookmarked' : 'Bookmark removed',
      isBookmarked,
      bookmarksCount: resource.bookmarks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarked resources
// @route   GET /api/bookmarks
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await Bookmark.countDocuments({ user: req.user._id });
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'resource',
        populate: {
          path: 'uploadedBy',
          select: 'name profileImage college'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out potential null references
    const validBookmarks = bookmarks
      .filter((b) => b.resource !== null)
      .map((b) => ({
        bookmarkId: b._id,
        bookmarkedAt: b.createdAt,
        ...b.resource.toObject()
      }));

    res.status(200).json({
      success: true,
      count: validBookmarks.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: validBookmarks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleBookmark,
  getUserBookmarks
};

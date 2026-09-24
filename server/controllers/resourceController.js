const Resource = require('../models/Resource');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Create a new academic resource (status -> pending)
// @route   POST /api/resources
// @access  Private (Student/Admin)
const createResource = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      category,
      semester,
      department,
      college,
      tags,
      resourceType,
      visibility
    } = req.body;

    if (!title || !description || !subject || !category || !semester || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, description, subject, category, semester, department)'
      });
    }

    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resource file (PDF, DOC, PPT, or Image)'
      });
    }

    const uploadedFile = req.files.file[0];
    const fileUrl = `/uploads/${uploadedFile.filename}`;
    const originalFileName = uploadedFile.originalname;
    const fileSize = uploadedFile.size;
    const fileMimeType = uploadedFile.mimetype;

    let thumbnailUrl = '';
    if (req.files.thumbnail && req.files.thumbnail.length > 0) {
      thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    // Parse tags if sent as string (e.g. comma separated)
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    // Check if category exists
    let matchedCat = await Category.findOne({ name: category });
    if (!matchedCat) {
      matchedCat = await Category.create({ name: category });
    }

    // Determine type from extension if not specified
    let determinedType = resourceType;
    if (!determinedType) {
      const ext = path.extname(originalFileName).toLowerCase();
      if (ext === '.pdf') determinedType = 'pdf';
      else if (ext === '.doc' || ext === '.docx') determinedType = 'doc';
      else if (ext === '.ppt' || ext === '.pptx') determinedType = 'ppt';
      else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) determinedType = 'image';
      else determinedType = 'other';
    }

    const resource = await Resource.create({
      title,
      description,
      subject,
      category: matchedCat.name,
      categoryId: matchedCat._id,
      semester: Number(semester),
      department,
      college: college || req.user.college || 'College/University',
      tags: parsedTags,
      resourceType: determinedType,
      fileUrl,
      originalFileName,
      fileSize,
      fileMimeType,
      thumbnailUrl,
      uploadedBy: req.user._id,
      status: 'pending', // Requires admin approval
      visibility: visibility || 'public'
    });

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully! It is now pending admin review.',
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resources with search, filter, sorting, pagination
// @route   GET /api/resources
// @access  Public / Optional Auth
const getResources = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const {
      search,
      category,
      semester,
      department,
      resourceType,
      sort,
      status
    } = req.query;

    const query = {};

    // By default, public query only returns approved resources
    if (status && req.user && req.user.role === 'admin') {
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      query.status = 'approved';
    }

    // Search query (title, subject, description, tags)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: regex } },
        { subject: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } },
        { department: { $regex: regex } },
        { category: { $regex: regex } }
      ];
    }

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }

    if (department && department !== 'All') {
      query.department = new RegExp(`^${department}$`, 'i');
    }

    if (resourceType && resourceType !== 'All') {
      query.resourceType = resourceType.toLowerCase();
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'popular' || sort === 'downloads') {
      sortOptions = { downloads: -1, averageRating: -1 };
    } else if (sort === 'rating') {
      sortOptions = { averageRating: -1, ratingCount: -1 };
    } else if (sort === 'bookmarks') {
      sortOptions = { bookmarks: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name email profileImage college department')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource details + interaction flags + related items
// @route   GET /api/resources/:id
// @access  Public / Optional Auth
const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'uploadedBy',
      'name email profileImage college department credits createdAt'
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Access check: only owner or admin can view pending/rejected
    if (resource.status !== 'approved') {
      const isOwner = req.user && req.user._id.toString() === resource.uploadedBy._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This resource is pending review and not publicly accessible yet.'
        });
      }
    }

    let isBookmarked = false;
    let userReview = null;

    if (req.user) {
      const bookmark = await Bookmark.findOne({
        resource: resource._id,
        user: req.user._id
      });
      isBookmarked = !!bookmark;

      userReview = await Review.findOne({
        resource: resource._id,
        user: req.user._id
      });
    }

    // Get related resources in the same category or subject
    const relatedResources = await Resource.find({
      _id: { $ne: resource._id },
      status: 'approved',
      $or: [{ category: resource.category }, { subject: resource.subject }]
    })
      .populate('uploadedBy', 'name profileImage')
      .limit(4);

    res.status(200).json({
      success: true,
      data: resource,
      meta: {
        isBookmarked,
        userReview,
        relatedResources
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource details
// @route   PUT /api/resources/:id
// @access  Private (Owner/Admin)
const updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this resource'
      });
    }

    const {
      title,
      description,
      subject,
      category,
      semester,
      department,
      college,
      tags,
      resourceType,
      visibility
    } = req.body;

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (subject) resource.subject = subject;
    if (category) {
      resource.category = category;
      const cat = await Category.findOne({ name: category });
      if (cat) resource.categoryId = cat._id;
    }
    if (semester) resource.semester = Number(semester);
    if (department) resource.department = department;
    if (college) resource.college = college;
    if (resourceType) resource.resourceType = resourceType;
    if (visibility) resource.visibility = visibility;

    if (tags) {
      if (Array.isArray(tags)) {
        resource.tags = tags;
      } else if (typeof tags === 'string') {
        resource.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    // If student edits a rejected resource, return it to pending for review
    if (isOwner && !isAdmin && resource.status === 'rejected') {
      resource.status = 'pending';
      resource.rejectionReason = '';
    }

    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Owner/Admin)
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resource'
      });
    }

    // Delete associated reviews and bookmarks
    await Review.deleteMany({ resource: resource._id });
    await Bookmark.deleteMany({ resource: resource._id });

    // Try deleting physical file if exists
    if (resource.fileUrl && resource.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete file:', e.message);
        }
      }
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resources uploaded by logged in user
// @route   GET /api/resources/my-uploads
// @access  Private
const getMyResources = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { uploadedBy: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    const stats = {
      total: await Resource.countDocuments({ uploadedBy: req.user._id }),
      approved: await Resource.countDocuments({ uploadedBy: req.user._id, status: 'approved' }),
      pending: await Resource.countDocuments({ uploadedBy: req.user._id, status: 'pending' }),
      rejected: await Resource.countDocuments({ uploadedBy: req.user._id, status: 'rejected' }),
      totalDownloads: resources.reduce((acc, curr) => acc + (curr.downloads || 0), 0)
    };

    res.status(200).json({
      success: true,
      stats,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get landing page resources (featured, popular, recent)
// @route   GET /api/resources/featured-summary
// @access  Public
const getFeaturedSummary = async (req, res, next) => {
  try {
    const popular = await Resource.find({ status: 'approved' })
      .populate('uploadedBy', 'name profileImage college')
      .sort({ downloads: -1, averageRating: -1 })
      .limit(6);

    const recent = await Resource.find({ status: 'approved' })
      .populate('uploadedBy', 'name profileImage college')
      .sort({ createdAt: -1 })
      .limit(6);

    const topContributors = await User.find({ role: 'student', isActive: true })
      .select('name college department profileImage credits')
      .sort({ credits: -1 })
      .limit(5);

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalResources = await Resource.countDocuments({ status: 'approved' });
    const totalDownloadsAgg = await Resource.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);
    const totalDownloads = totalDownloadsAgg.length > 0 ? totalDownloadsAgg[0].total : 0;
    const totalCategories = await Category.countDocuments();

    res.status(200).json({
      success: true,
      popular,
      recent,
      topContributors,
      stats: {
        totalStudents,
        totalResources,
        totalDownloads,
        totalCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getMyResources,
  getFeaturedSummary
};

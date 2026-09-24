const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a resource title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject/course name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    semester: {
      type: Number,
      required: [true, 'Please specify the semester'],
      min: 1,
      max: 12
    },
    department: {
      type: String,
      required: [true, 'Please specify the department'],
      trim: true
    },
    college: {
      type: String,
      trim: true,
      default: 'College/University'
    },
    tags: {
      type: [String],
      default: []
    },
    resourceType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'image', 'other'],
      default: 'pdf'
    },
    fileUrl: {
      type: String,
      required: [true, 'Resource file is required']
    },
    originalFileName: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number, // in bytes
      default: 0
    },
    fileMimeType: {
      type: String,
      default: ''
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    downloads: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high performance text search and filtering
resourceSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });
resourceSchema.index({ category: 1, status: 1 });
resourceSchema.index({ semester: 1, department: 1, status: 1 });
resourceSchema.index({ uploadedBy: 1, status: 1 });
resourceSchema.index({ downloads: -1 });
resourceSchema.index({ averageRating: -1 });
resourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);

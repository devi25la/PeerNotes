const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: [
        'Copyright issue',
        'Incorrect content',
        'Spam',
        'Offensive content',
        'Duplicate resource',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Please provide details about the issue'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Report', reportSchema);

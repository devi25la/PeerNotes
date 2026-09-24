const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate bookmarks
bookmarkSchema.index({ resource: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);

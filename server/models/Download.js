const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
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
    creditCharged: {
      type: Number,
      default: 1
    },
    downloadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

downloadSchema.index({ user: 1, downloadedAt: -1 });
downloadSchema.index({ resource: 1 });

module.exports = mongoose.model('Download', downloadSchema);

const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      required: true,
      enum: [
        'upload_reward',      // +10 credits when admin approves upload
        'download_cost',      // -1 credit when student downloads a resource
        'download_milestone', // +5 credits when resource reaches 10 downloads
        'rating_bonus',       // +3 credits when resource gets high ratings
        'welcome_bonus',      // Initial credits on signup
        'admin_adjustment'    // Manual change by admin
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }
  },
  {
    timestamps: true
  }
);

creditTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CreditTransaction', creditTransactionSchema);

const CreditTransaction = require('../models/CreditTransaction');
const User = require('../models/User');

// @desc    Get current user's credit transactions ledger
// @route   GET /api/credits/history
// @access  Private
const getMyCreditTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).select('credits');
    const total = await CreditTransaction.countDocuments({ user: req.user._id });

    const transactions = await CreditTransaction.find({ user: req.user._id })
      .populate('resource', 'title subject category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate totals
    const earnedAgg = await CreditTransaction.aggregate([
      { $match: { user: req.user._id, amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const spentAgg = await CreditTransaction.aggregate([
      { $match: { user: req.user._id, amount: { $lt: 0 } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalEarned = earnedAgg.length > 0 ? earnedAgg[0].total : 0;
    const totalSpent = spentAgg.length > 0 ? Math.abs(spentAgg[0].total) : 0;

    res.status(200).json({
      success: true,
      currentBalance: user.credits,
      totalEarned,
      totalSpent,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCreditTransactions
};

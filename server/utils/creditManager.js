const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');

/**
 * Adjusts user credits and creates an immutable credit transaction record
 * @param {string|ObjectId} userId
 * @param {number} amount (+ve or -ve)
 * @param {string} type
 * @param {string} description
 * @param {string|ObjectId} [resourceId]
 * @returns {Promise<{success: boolean, user: Object, transaction: Object}>}
 */
const adjustCredits = async (userId, amount, type, description, resourceId = null) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found for credit adjustment');
  }

  // Prevent negative balance
  if (amount < 0 && user.credits + amount < 0) {
    const error = new Error('Insufficient credits');
    error.statusCode = 400;
    throw error;
  }

  const newBalance = Math.max(0, (user.credits || 0) + amount);
  user.credits = newBalance;
  await user.save();

  const transaction = await CreditTransaction.create({
    user: userId,
    amount,
    balanceAfter: newBalance,
    type,
    description,
    resource: resourceId || null
  });

  return { success: true, user, transaction };
};

module.exports = {
  adjustCredits
};

import React, { useState } from 'react';
import { X, Star, Send, Loader2 } from 'lucide-react';
import RatingStars from './RatingStars';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ReviewModal = ({ isOpen, onClose, resourceId, resourceTitle, existingReview, onReviewSubmitted }) => {
  const { showSuccess, showError } = useToast();
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showError('Please write a short review comment explaining why this was helpful.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/reviews/${resourceId}`, { rating, comment: comment.trim() });
      if (res.data.success) {
        showSuccess(res.data.message);
        if (onReviewSubmitted) {
          onReviewSubmitted(res.data.data, res.data.averageRating, res.data.ratingCount);
        }
        onClose();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {existingReview ? 'Update Your Review' : 'Rate & Review Resource'}
        </h3>
        <p className="text-xs text-slate-500 mb-5 line-clamp-1 font-medium">
          "{resourceTitle}"
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Select Rating</span>
            <RatingStars
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={(newVal) => setRating(newVal)}
            />
            <span className="text-xs font-bold text-indigo-600">
              {rating === 5 && '⭐⭐⭐⭐⭐ Exceptional (5/5)'}
              {rating === 4 && '⭐⭐⭐⭐ Very Good (4/5)'}
              {rating === 3 && '⭐⭐⭐ Good / Adequate (3/5)'}
              {rating === 2 && '⭐⭐ Needs Improvement (2/5)'}
              {rating === 1 && '⭐ Poor Quality (1/5)'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Your Review / Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How well did these notes help you understand the subject? Mention units covered, diagram clarity, or exam relevance..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              maxLength={1000}
              required
            />
            <div className="text-[11px] text-slate-400 text-right mt-1">
              {comment.length} / 1000 characters
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

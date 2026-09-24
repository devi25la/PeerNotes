import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ReportModal = ({ isOpen, onClose, resourceId, resourceTitle }) => {
  const { showSuccess, showError } = useToast();
  const [reason, setReason] = useState('Incorrect content');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    'Incorrect content',
    'Copyright issue',
    'Spam',
    'Offensive content',
    'Duplicate resource',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showError('Please explain the reason for your report in detail.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/reports', {
        resourceId,
        reason,
        description: description.trim()
      });
      if (res.data.success) {
        showSuccess(res.data.message);
        onClose();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit report');
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

        <div className="flex items-center gap-2.5 mb-1 text-rose-600">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="text-xl font-bold text-slate-900">Report Inappropriate Resource</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5 line-clamp-1">
          Regarding: "{resourceTitle}"
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium text-slate-800"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Detailed Description of the Issue
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details (e.g. wrong page numbers, misleading title, inappropriate material)..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              maxLength={1000}
              required
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              All reports are anonymously reviewed by the PeerNotes editorial board. False reporting may result in penalty.
            </span>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

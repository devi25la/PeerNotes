import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Check,
  X,
  Eye,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Loader2,
  Sparkles
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ManageResources = () => {
  const { showSuccess, showError } = useToast();

  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Action Modals
  const [previewResource, setPreviewResource] = useState(null);
  const [rejectModalTarget, setRejectModalTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        status: activeTab,
        sort: 'newest'
      };
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/resources', { params });
      if (res.data.success) {
        setResources(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchResources();
  };

  // Approve resource
  const handleApprove = async (resource) => {
    try {
      setProcessing(true);
      const res = await api.put(`/admin/resources/${resource._id}/approve`);
      if (res.data.success) {
        showSuccess(res.data.message || 'Resource approved and +10 credits awarded!');
        fetchResources();
        if (previewResource?._id === resource._id) setPreviewResource(null);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  // Reject resource
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showError('Please provide a clear rejection reason');
      return;
    }

    try {
      setProcessing(true);
      const res = await api.put(`/admin/resources/${rejectModalTarget._id}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      if (res.data.success) {
        showSuccess('Resource rejected and feedback saved');
        setRejectModalTarget(null);
        setRejectionReason('');
        fetchResources();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  // Delete resource
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setProcessing(true);
      const res = await api.delete(`/resources/${deleteTarget._id}`);
      if (res.data.success) {
        showSuccess('Resource deleted');
        setDeleteTarget(null);
        fetchResources();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Delete failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Resource Moderation & Approvals</h1>
        <p className="text-xs text-slate-500">
          Review student uploaded study notes, verify academic accuracy, award +10 credits, or send constructive feedback.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-200 pb-2 md:pb-0 overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Approvals' },
            { id: 'approved', label: 'Approved (Public)' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Submissions' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, course..."
            className="w-full text-xs rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </form>
      </div>

      {/* Resources Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-3">
          {resources.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-200 transition-all"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-purple-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Sem {item.semester} • {item.subject}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                <p className="text-[11px] text-slate-400">
                  Uploader: <strong className="text-slate-700">{item.uploadedBy?.name}</strong> ({item.uploadedBy?.college || 'University'}) • Submitted: {new Date(item.createdAt).toLocaleDateString()}
                </p>

                {item.status === 'rejected' && item.rejectionReason && (
                  <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <strong>Reason:</strong> {item.rejectionReason}
                  </p>
                )}
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {/* View/Preview Modal */}
                <button
                  type="button"
                  onClick={() => setPreviewResource(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {/* Direct file link */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Open file directly"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Approve Button */}
                {item.status !== 'approved' && (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleApprove(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    title="Approve & Award +10 Credits"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve (+10)</span>
                  </button>
                )}

                {/* Reject Button */}
                {item.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModalTarget(item);
                      setRejectionReason(item.rejectionReason || '');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
                    title="Reject with Reason"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                  title="Delete permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No resources found in "{activeTab}" tab.
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Inspect / Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-purple-100 text-purple-800">
                Resource Inspection
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{previewResource.title}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {previewResource.subject} • {previewResource.category} • Semester {previewResource.semester}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              <strong className="block font-bold text-slate-900 mb-1">Author Description:</strong>
              {previewResource.description}
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl text-xs">
              <span className="font-semibold text-indigo-900">
                File: {previewResource.originalFileName || 'Document.pdf'}
              </span>
              <a
                href={previewResource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              {previewResource.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => handleApprove(previewResource)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Approve & Award +10 Credits
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Reason */}
      {rejectModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Reject Academic Resource</h3>
              <button onClick={() => setRejectModalTarget(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1">
              Resource: "{rejectModalTarget.title}"
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rejection Reason (visible to student) *
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Unclear scanned handwriting in Unit 2, missing subject course code, or duplicate materials..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Admin Delete Resource"
        message={`Permanently remove "${deleteTarget?.title}" from database and server disk?`}
        confirmText="Yes, Delete"
        type="danger"
        loading={processing}
      />
    </div>
  );
};

export default ManageResources;

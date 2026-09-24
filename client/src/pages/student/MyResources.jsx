import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Upload,
  Eye,
  Edit,
  Trash2,
  Download,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MyResources = () => {
  const { refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyResources = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resources/my-uploads?status=${activeTab}`);
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch your resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, [activeTab]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/resources/${deleteTarget._id}`);
      if (res.data.success) {
        showSuccess('Resource deleted successfully');
        setResources((prev) => prev.filter((r) => r._id !== deleteTarget._id));
        setDeleteTarget(null);
        refreshUser();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Uploaded Resources</h1>
          <p className="text-xs text-slate-500">
            Track verification status, downloads received, student ratings, and edit your notes.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Note (+10)</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Notes' },
          { id: 'approved', label: 'Approved (Live)' },
          { id: 'pending', label: 'Pending Review' },
          { id: 'rejected', label: 'Needs Revision' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resources Table / List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-3">
          {resources.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Sem {item.semester} • {item.subject}
                  </span>
                </div>

                <Link
                  to={`/resources/${item._id}`}
                  className="font-bold text-slate-900 text-base hover:text-indigo-600 block line-clamp-1"
                >
                  {item.title}
                </Link>

                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Rejection Feedback:</strong> {item.rejectionReason} (Click Edit to update and re-submit)
                    </span>
                  </div>
                )}
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Downloads</span>
                    <span className="font-bold text-slate-800">{item.downloads || 0}</span>
                  </div>
                  <div className="text-center border-l border-slate-100 pl-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rating</span>
                    <span className="font-bold text-slate-800">{item.averageRating > 0 ? `${item.averageRating}★` : '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/resources/${item._id}`}
                    title="View details"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/my-resources/edit/${item._id}`}
                    title="Edit resource"
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    title="Delete resource"
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No resources in this tab</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your lecture notes, previous question papers, or exam cheatsheets to earn peer credits!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes (+10 Credits)</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Academic Resource"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All reviews and student downloads associated with this resource will also be removed.`}
        confirmText="Yes, Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default MyResources;

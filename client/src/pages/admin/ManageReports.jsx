import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Trash2,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ManageReports = () => {
  const { showSuccess, showError } = useToast();

  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Resolution modal state
  const [actionModalReport, setActionModalReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState('resolve'); // 'resolve', 'dismiss', 'reject'

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports?status=${statusFilter}`);
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const res = await api.put(`/reports/${actionModalReport._id}`, {
        status: actionType === 'dismiss' ? 'dismissed' : 'resolved',
        adminNotes,
        actionOnResource: actionType === 'reject' ? 'reject' : 'keep'
      });

      if (res.data.success) {
        showSuccess('Moderation action recorded');
        setActionModalReport(null);
        setAdminNotes('');
        fetchReports();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Content Moderation & Reports</h1>
        <p className="text-xs text-slate-500">
          Investigate reported study resources flagged by students for copyright, inaccuracies, or guidelines violations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'pending', label: 'Pending Moderation' },
          { id: 'resolved', label: 'Resolved' },
          { id: 'dismissed', label: 'Dismissed Reports' },
          { id: 'all', label: 'All History' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:border-rose-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                    {rep.reason}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      rep.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : rep.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Status: {rep.status}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400">
                  Reported: {new Date(rep.createdAt).toLocaleDateString()} by {rep.reportedBy?.name} ({rep.reportedBy?.college})
                </span>
              </div>

              {/* Reported Resource Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Flagged Resource</span>
                  <h4 className="font-bold text-slate-900 text-sm">{rep.resource?.title || 'Resource Title'}</h4>
                  <p className="text-xs text-slate-500">Category: {rep.resource?.category} • Subject: {rep.resource?.subject}</p>
                </div>
                {rep.resource && (
                  <a
                    href={rep.resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline shrink-0"
                  >
                    <span>Inspect Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="font-bold text-slate-900 block mb-1">Reporter Statement:</strong>
                "{rep.description}"
              </div>

              {rep.adminNotes && (
                <div className="text-xs text-slate-600 bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                  <strong className="font-bold text-purple-900 block mb-0.5">Admin Resolution Log:</strong>
                  {rep.adminNotes} (Resolved by: {rep.resolvedBy?.name || 'Moderator'})
                </div>
              )}

              {/* Action Buttons */}
              {rep.status === 'pending' && (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionModalReport(rep);
                      setActionType('dismiss');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Dismiss Report
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionModalReport(rep);
                      setActionType('resolve');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Mark Resolved (Keep Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionModalReport(rep);
                      setActionType('reject');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Reject & Remove Resource
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No reports in "{statusFilter}" queue.
        </div>
      )}

      {/* Action Modal */}
      {actionModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {actionType === 'reject'
                  ? 'Reject & Take Down Resource'
                  : actionType === 'dismiss'
                  ? 'Dismiss Flag'
                  : 'Resolve Report'}
              </h3>
              <button onClick={() => setActionModalReport(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Resolution Notes (Internal Archive)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Note findings, copyright verification steps, or guidelines applied..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalReport(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`px-5 py-2 rounded-xl text-white font-bold text-xs ${
                    actionType === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Confirm Moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReports;

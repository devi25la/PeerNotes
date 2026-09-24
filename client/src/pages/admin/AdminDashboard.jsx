import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  AlertTriangle,
  FolderKanban,
  Star,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Coins
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { showError } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-3xl border border-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  const { stats, topContributors, recentPending, categoryDistribution } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>System Administration & Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Executive Platform Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Monitor student registrations, resource approvals, download volume, and moderation reports.
        </p>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalStudents || 0}</div>
          <Link to="/admin/users" className="text-[11px] font-bold text-indigo-600 hover:underline block">
            Manage Directory →
          </Link>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-2 bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.pendingResources || 0}</div>
          <Link to="/admin/resources" className="text-[11px] font-bold text-amber-700 hover:underline block">
            Review Queue →
          </Link>
        </div>

        {/* Approved Resources */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved Notes</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.approvedResources || 0}</div>
          <span className="text-[11px] text-slate-400">Live in marketplace</span>
        </div>

        {/* Rejected Notes */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rejected Notes</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{stats?.rejectedResources || 0}</div>
          <span className="text-[11px] text-slate-400">Feedback dispatched</span>
        </div>

        {/* Total Downloads */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Downloads</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600">{stats?.totalDownloads || 0}</div>
          <span className="text-[11px] text-slate-400">Peer exchanges</span>
        </div>

        {/* Active Reports */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reports Queue</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{stats?.pendingReports || 0}</div>
          <Link to="/admin/reports" className="text-[11px] font-bold text-rose-600 hover:underline block">
            Moderate Reports →
          </Link>
        </div>

        {/* Total Reviews */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reviews & Ratings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.totalReviews || 0}</div>
          <span className="text-[11px] text-slate-400">Peer evaluations</span>
        </div>

        {/* Academic Categories */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalCategories || 0}</div>
          <Link to="/admin/categories" className="text-[11px] font-bold text-indigo-600 hover:underline block">
            Manage Categories →
          </Link>
        </div>
      </div>

      {/* 2-Column: Quick Pending Queue + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pending Approvals */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Moderation Queue ({stats?.pendingResources || 0})</span>
            </h3>
            <Link
              to="/admin/resources"
              className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPending && recentPending.length > 0 ? (
            <div className="space-y-3">
              {recentPending.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {item.category} • Sem {item.semester}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Uploaded by: {item.uploadedBy?.name} ({item.uploadedBy?.college})
                    </p>
                  </div>
                  <Link
                    to="/admin/resources"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All uploaded resources are reviewed! No pending items in queue.
            </div>
          )}
        </div>

        {/* Category Breakdown & Top Contributors */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Category Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-600" />
              <span>Top Academic Disciplines</span>
            </h3>
            <div className="space-y-2.5">
              {categoryDistribution?.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate pr-2">{cat._id}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold shrink-0">
                    {cat.count} notes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Top Student Earners</span>
            </h3>
            <div className="space-y-3 divide-y divide-slate-100">
              {topContributors?.map((student) => (
                <div key={student._id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{student.college}</p>
                  </div>
                  <span className="font-black text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                    {student.credits} cr
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

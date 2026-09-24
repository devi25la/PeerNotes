import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Bookmark,
  Star,
  Coins,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ResourceCard from '../../components/ResourceCard';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalDownloads: 0
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentCredits, setRecentCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [uploadRes, creditRes] = await Promise.all([
          api.get('/resources/my-uploads?limit=4'),
          api.get('/credits/history?limit=5')
        ]);

        if (uploadRes.data.success) {
          setStats(uploadRes.data.stats);
          setRecentUploads(uploadRes.data.data.slice(0, 4));
        }
        if (creditRes.data.success) {
          setRecentCredits(creditRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Contributor Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-lg">
            Share your university notes to earn credits. Every approved upload awards <strong className="text-emerald-300 font-bold">+10 credits</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/upload"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes (+10)</span>
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all backdrop-blur-md active:scale-95 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Library</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Uploads */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
            <p className="text-xs font-semibold text-slate-500">Total Uploaded</p>
          </div>
        </div>

        {/* Approved Uploads */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{stats.approved}</div>
            <p className="text-xs font-semibold text-slate-500">Approved Notes</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{stats.pending}</div>
            <p className="text-xs font-semibold text-slate-500">Pending Review</p>
          </div>
        </div>

        {/* Total Downloads Received */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{stats.totalDownloads}</div>
            <p className="text-xs font-semibold text-slate-500">Peer Downloads</p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Recent Uploads + Credit Activity Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: My Uploaded Notes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>My Recent Uploads</span>
            </h3>
            <Link
              to="/my-resources"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentUploads.length > 0 ? (
            <div className="space-y-3">
              {recentUploads.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4 hover:border-indigo-200 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
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
                      <span className="text-[11px] font-semibold text-slate-400">
                        Sem {item.semester} • {item.category}
                      </span>
                    </div>
                    <Link
                      to={`/resources/${item._id}`}
                      className="font-bold text-slate-900 text-sm hover:text-indigo-600 line-clamp-1"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      {item.downloads || 0}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <Upload className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">You haven't uploaded any study materials yet.</p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
              >
                Upload Your First Note (+10 Credits)
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Recent Credit Transactions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Credit Activity</span>
            </h3>
            <Link
              to="/credits"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            {recentCredits.length > 0 ? (
              <div className="space-y-3 divide-y divide-slate-100">
                {recentCredits.map((tx) => (
                  <div key={tx._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div
                      className={`font-black text-xs px-2 py-0.5 rounded-md shrink-0 ${
                        tx.amount > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent transactions.</p>
            )}

            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/credits"
                className="block text-center text-xs font-bold text-indigo-600 hover:underline"
              >
                View detailed credit rules & history →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

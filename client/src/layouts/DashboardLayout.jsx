import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  LayoutDashboard,
  Upload,
  Layers,
  Bookmark,
  Download,
  Coins,
  User,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreditBadge from '../components/CreditBadge';

const DashboardLayout = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Notes (+10)', path: '/upload', icon: Upload, highlight: true },
    { label: 'My Uploaded Notes', path: '/my-resources', icon: Layers },
    { label: 'Saved Bookmarks', path: '/bookmarks', icon: Bookmark },
    { label: 'Download History', path: '/downloads', icon: Download },
    { label: 'Credit Ledger', path: '/credits', icon: Coins },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{sidebarOpen ? 'Close Menu' : 'Dashboard Menu'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 lg:block ${
              sidebarOpen ? 'block mb-6' : 'hidden'
            } space-y-4`}
          >
            {/* User card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-bold text-lg flex items-center justify-center overflow-hidden shadow-sm">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'S'
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{user?.college || 'University Student'}</p>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80 block">Credit Balance</span>
                  <span className="text-lg font-extrabold text-amber-900">{user?.credits || 0}</span>
                  <span className="text-xs text-amber-700 ml-1 font-medium">credits</span>
                </div>
                <Link
                  to="/upload"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  + Earn
                </Link>
              </div>
            </div>

            {/* Navigation items */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-3 shadow-xs space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : item.highlight
                        ? 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </NavLink>
                );
              })}

              {isAdmin && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Moderation</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;

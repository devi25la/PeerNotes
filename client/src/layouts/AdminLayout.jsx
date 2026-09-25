import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  CheckSquare,
  Users,
  AlertTriangle,
  FolderKanban,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Resource Approvals', path: '/admin/resources', icon: CheckSquare },
    { label: 'Student Management', path: '/admin/users', icon: Users },
    { label: 'Reported Content', path: '/admin/reports', icon: AlertTriangle },
    { label: 'Category Directory', path: '/admin/categories', icon: FolderKanban }
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Educational Theme Fullscreen Background */}
      <div className="educational-bg" aria-hidden="true" />
      <div className="educational-overlay" aria-hidden="true" />

      <Navbar />

      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold tracking-wide uppercase text-slate-300">
              PeerNotes Administrative Portal
            </span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Student View</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">Admin Controls</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Menu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar */}
          <aside className={`lg:col-span-3 lg:block ${sidebarOpen ? 'block mb-6' : 'hidden'} space-y-4`}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Moderation Controls
              </div>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </NavLink>
                );
              })}
            </div>
          </aside>

          {/* Admin Main Content */}
          <main className="lg:col-span-9 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Upload,
  User,
  LayoutDashboard,
  Bookmark,
  Download,
  Coins,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreditBadge from './CreditBadge';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                Peer<span className="text-indigo-600">Notes</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                Student Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search DBMS notes, OS scheduling, PYQs, algorithms..."
              className="w-full text-xs rounded-xl bg-slate-100/90 pl-9 pr-4 py-2 border border-slate-200/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all font-medium"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link
              to="/browse"
              className={`hover:text-indigo-600 transition-colors ${
                location.pathname === '/browse' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Browse Notes
            </Link>
            <Link
              to="/#categories"
              className="hover:text-indigo-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/#how-it-works"
              className="hover:text-indigo-600 transition-colors"
            >
              Credit System
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Credit Balance Badge */}
                <CreditBadge credits={user?.credits || 0} />

                {/* Upload Button */}
                <Link
                  to="/upload"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs transition-all shadow-xs shadow-indigo-600/20 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Resource</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 overflow-hidden flex items-center justify-center font-bold text-xs">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              user?.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {user?.role}
                          </span>
                          <span className="text-xs font-semibold text-amber-700">
                            {user?.credits} Credits
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs text-slate-700">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 hover:text-purple-700 font-semibold transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            Admin Moderation Portal
                          </Link>
                        )}
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/my-resources"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <Layers className="w-4 h-4 text-slate-500" />
                          My Uploaded Notes
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-slate-500" />
                          Saved Bookmarks
                        </Link>
                        <Link
                          to="/downloads"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <Download className="w-4 h-4 text-slate-500" />
                          Download History
                        </Link>
                        <Link
                          to="/credits"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <Coins className="w-4 h-4 text-amber-500" />
                          Credit Ledger (+ History)
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          Edit Profile
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs shadow-indigo-600/20 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Get 50 Credits</span>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, subjects, tags..."
                className="w-full text-xs rounded-xl bg-slate-100 pl-9 pr-4 py-2.5 border border-slate-200 focus:bg-white"
              />
            </form>

            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              <Link to="/browse" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                Browse Resources
              </Link>
              <Link to="/#categories" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                Explore Categories
              </Link>
              <Link to="/#how-it-works" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                Credit System Rules
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/upload" className="px-3 py-2 rounded-lg text-indigo-600 font-bold bg-indigo-50">
                    + Upload New Resource (+10 Credits)
                  </Link>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                    Student Dashboard
                  </Link>
                  <Link to="/my-resources" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                    My Resources
                  </Link>
                  <Link to="/credits" className="px-3 py-2 rounded-lg hover:bg-slate-100">
                    Credit History ({user?.credits} Credits)
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="px-3 py-2 rounded-lg text-purple-700 bg-purple-50">
                      Admin Moderation Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ShieldCheck, Sparkles, GraduationCap, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Peer<span className="text-indigo-400">Notes</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier open academic marketplace for college students. Share verified lecture notes, semester previous question papers, lab manuals, and earn peer credits.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Peer-Reviewed & Admin Verified</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/browse" className="hover:text-indigo-400 transition-colors">
                  All Resources
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Data%20Structures" className="hover:text-indigo-400 transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Database%20Management" className="hover:text-indigo-400 transition-colors">
                  DBMS & SQL Notes
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Previous%20Question%20Papers" className="hover:text-indigo-400 transition-colors">
                  Previous Year Solved Papers
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Lab%20Manuals" className="hover:text-indigo-400 transition-colors">
                  Engineering Lab Manuals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Credit Economics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Credit Rewards
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">+10</span>
                <span>Upload Approved Note</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">+5</span>
                <span>10-Download Milestone</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">+3</span>
                <span>5 Positive Ratings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">-1</span>
                <span>Download Any Resource</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-400 font-bold">+50</span>
                <span>Welcome Starter Bonus</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Account & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Student Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/upload" className="hover:text-indigo-400 transition-colors font-medium text-indigo-400">
                  + Upload Study Resource
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-indigo-400 transition-colors">
                  Credit Transactions
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-indigo-400 transition-colors">
                  My Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-indigo-400 transition-colors">
                  Download History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PeerNotes. Academic Resource Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for College Students Everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

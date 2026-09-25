import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Sparkles,
  Download,
  Users,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Coins,
  Star,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import { CardSkeleton } from '../../components/SkeletonLoader';
import api from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, catRes] = await Promise.all([
          api.get('/resources/featured-summary'),
          api.get('/categories')
        ]);

        if (summaryRes.data.success) {
          setSummaryData(summaryRes.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-indigo-200 backdrop-blur-md animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Join 10,000+ university students sharing verified notes</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="text-amber-300 hidden sm:inline font-bold">+50 Free Starter Credits</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Share Knowledge. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
                Learn Together.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Discover notes, study materials, previous papers, lab manuals and resources shared by students.
            </p>
          </div>

          {/* Instant Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
          >
            <Search className="w-5 h-5 text-slate-400 absolute left-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, course (DBMS, OS, DSA), subject or college..."
              className="w-full pl-12 pr-28 sm:pr-32 py-3.5 text-sm text-slate-900 placeholder-slate-400 rounded-xl focus:outline-hidden font-medium"
            />
            <button
              type="submit"
              className="absolute right-3 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              Search
            </button>
          </form>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/browse"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Explore Resources
            </Link>
            <Link
              to="/upload"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all backdrop-blur-md active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Share Your Knowledge (+10)
            </Link>
          </div>

          {/* Popular Tag Pills */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {['DBMS', 'Operating Systems', 'Data Structures', 'Machine Learning', 'Computer Networks', 'PYQ 2024'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/browse?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

        </div>
      </section>

      {/* 2. PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {summaryData?.stats?.totalResources || 35}+
              </div>
              <p className="text-xs font-semibold text-slate-500">Verified Study Notes</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {summaryData?.stats?.totalStudents || 10}+
              </div>
              <p className="text-xs font-semibold text-slate-500">Student Contributors</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {summaryData?.stats?.totalDownloads || 450}+
              </div>
              <p className="text-xs font-semibold text-slate-500">Resource Downloads</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {summaryData?.stats?.totalCategories || 15}
              </div>
              <p className="text-xs font-semibold text-slate-500">Academic Subjects</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR / TRENDING RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Most Downloaded & Highly Rated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Popular Resources
            </h2>
          </div>
          <Link
            to="/browse?sort=popular"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaryData?.popular?.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        )}
      </section>

      {/* 4. BROWSE BY CATEGORIES */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Layers className="w-4 h-4" />
              <span>Curated Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Browse by Academic Subject
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description || 'Explore university lecture notes and exam guides.'}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{cat.resourceCount || 0} notes</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS / CREDIT SYSTEM */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5" />
              <span>Peer-to-Peer Economics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              How the Student Credit System Works
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              PeerNotes runs on a fair peer-contribution system. Quality notes are rewarded with credits that unlock access across university subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xl">
                1
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+50 Credits</span>
              </div>
              <h3 className="text-lg font-bold text-white">Sign Up & Get Starter Bonus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a student profile with your college and department to instantly receive 50 complimentary credits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl">
                2
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10 Credits</span>
              </div>
              <h3 className="text-lg font-bold text-white">Upload Approved Notes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Share your handwritten lecture notes, solved papers, or lab manuals. Receive +10 credits on admin approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
                3
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>+5 & +3 Milestones</span>
              </div>
              <h3 className="text-lg font-bold text-white">Earn Popularity Milestones</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every 10 downloads on your notes awards you +5 bonus credits. 5 positive ratings awards +3 credits!
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-xl">
                4
              </div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                <Download className="w-3.5 h-3.5" />
                <span>-1 Credit</span>
              </div>
              <h3 className="text-lg font-bold text-white">Download Academic Material</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download any verified study material from peers across universities for only 1 credit per resource.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY ADDED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>Freshly Approved Submissions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Recently Added Resources
            </h2>
          </div>
          <Link
            to="/browse?sort=newest"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaryData?.recent?.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        )}
      </section>

      {/* 7. TOP STUDENT CONTRIBUTORS LEADERBOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-3xl p-8 border border-indigo-100 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Award className="w-4 h-4" />
                <span>Honor Roll</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Top Student Contributors</h2>
            </div>
            <Link
              to="/upload"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
            >
              Join the Leaderboard
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {summaryData?.topContributors?.map((contributor, idx) => (
              <div
                key={contributor._id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden shrink-0 font-bold text-xs flex items-center justify-center text-indigo-700">
                    {contributor.profileImage ? (
                      <img src={contributor.profileImage} alt={contributor.name} className="w-full h-full object-cover" />
                    ) : (
                      contributor.name.charAt(0)
                    )}
                  </div>
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                    #{idx + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{contributor.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{contributor.college}</p>
                  <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {contributor.credits} credits
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-10 sm:p-14 text-white text-center space-y-6 shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Ace Your Semester Exams?
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Upload your semester notes to earn credits, or explore thousands of verified study guides from top university peers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 shadow-md transition-all active:scale-95"
              >
                Sign Up (+50 Free Credits)
              </Link>
              <Link
                to="/browse"
                className="px-6 py-3 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
              >
                Browse All Notes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

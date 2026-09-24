import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Frown, BookOpen, Trash2 } from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import Pagination from '../../components/Pagination';
import { CardSkeleton } from '../../components/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const MyBookmarks = () => {
  const { showError } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookmarks?page=${page}&limit=12`);
      if (res.data.success) {
        setBookmarks(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [page]);

  const handleBookmarkToggled = (resourceId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b._id !== resourceId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Saved Bookmarks</h1>
        <p className="text-xs text-slate-500">
          Quickly access your pinned academic notes, formula sheets, and study materials.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((res) => (
              <ResourceCard
                key={res._id}
                resource={{ ...res, isBookmarked: true }}
                onBookmarkToggled={handleBookmarkToggled}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No saved bookmarks yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the marketplace and click the bookmark icon on any resource card to save it for later revision.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Academic Resources</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;

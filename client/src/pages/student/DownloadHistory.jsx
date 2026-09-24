import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, ExternalLink, Calendar, BookOpen, Clock } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DownloadHistory = () => {
  const { showError } = useToast();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/downloads/history?page=${page}&limit=12`);
      if (res.data.success) {
        setDownloads(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch download history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Download History</h1>
        <p className="text-xs text-slate-500">
          All study materials and exam guides downloaded to your account.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : downloads.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {downloads.map((d) => (
                <div
                  key={d._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                        {d.resource?.category || 'Academic'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {d.resource?.subject}
                      </span>
                    </div>

                    <Link
                      to={`/resources/${d.resource?._id}`}
                      className="font-bold text-slate-900 text-sm hover:text-indigo-600 block line-clamp-1"
                    >
                      {d.resource?.title}
                    </Link>

                    <p className="text-[11px] text-slate-400">
                      Author: {d.resource?.uploadedBy?.name || 'Peer Student'} • {d.resource?.uploadedBy?.college}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right text-xs">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(d.downloadedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {d.creditCharged === 0 ? 'Free (Author)' : '1 Credit Charged'}
                      </span>
                    </div>

                    <a
                      href={d.resource?.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Re-download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <Download className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No downloads yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't downloaded any notes yet. Browse the discovery marketplace to get started.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Discover Resources</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  FileCode,
  Presentation,
  Image as ImageIcon,
  Download,
  Bookmark,
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ResourceCard = ({ resource, onBookmarkToggled }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(resource.isBookmarked || false);
  const [bookmarkCount, setBookmarkCount] = useState(resource.bookmarks || 0);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const typeConfig = {
    pdf: { label: 'PDF', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: FileText },
    doc: { label: 'DOC', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileText },
    docx: { label: 'DOCX', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileText },
    ppt: { label: 'PPT', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Presentation },
    pptx: { label: 'PPTX', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Presentation },
    image: { label: 'IMG', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ImageIcon },
    other: { label: 'FILE', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: FileCode }
  };

  const type = typeConfig[resource.resourceType?.toLowerCase()] || typeConfig.pdf;
  const TypeIcon = type.icon;

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showError('Please login to bookmark study resources');
      navigate('/login');
      return;
    }

    try {
      setLoadingBookmark(true);
      const res = await api.post(`/bookmarks/${resource._id}`);
      if (res.data.success) {
        setIsBookmarked(res.data.isBookmarked);
        setBookmarkCount(res.data.bookmarksCount);
        showSuccess(res.data.message);
        if (onBookmarkToggled) {
          onBookmarkToggled(resource._id, res.data.isBookmarked);
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setLoadingBookmark(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card-hover hover:border-indigo-300 transition-all duration-300 overflow-hidden">
      {/* Top Accent / Card Header */}
      <div className="p-5 pb-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${type.bg}`}
            >
              <TypeIcon className="w-3 h-3" />
              {type.label}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              Sem {resource.semester}
            </span>
            {resource.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Featured
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            disabled={loadingBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
            className={`p-1.5 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Category badge */}
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
          {resource.category}
        </p>

        {/* Title */}
        <Link to={`/resources/${resource._id}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-1.5">
            {resource.title}
          </h3>
        </Link>

        {/* Subject */}
        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{resource.subject}</span>
        </p>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {resource.description}
        </p>

        {/* Author info */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
          <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
            {resource.uploadedBy?.profileImage ? (
              <img
                src={resource.uploadedBy.profileImage}
                alt={resource.uploadedBy.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                {resource.uploadedBy?.name?.charAt(0) || 'S'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-800 truncate">
              {resource.uploadedBy?.name || 'Verified Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <School className="w-3 h-3" />
              {resource.college || resource.uploadedBy?.college || 'University'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <RatingStars rating={resource.averageRating} size="xs" showScore={true} reviewCount={resource.ratingCount} />
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-500" title={`${resource.downloads || 0} Downloads`}>
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{resource.downloads || 0}</span>
          </span>

          <Link
            to={`/resources/${resource._id}`}
            className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;

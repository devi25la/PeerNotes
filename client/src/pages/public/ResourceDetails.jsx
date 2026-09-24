import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Bookmark,
  Star,
  ShieldAlert,
  GraduationCap,
  School,
  Calendar,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Coins,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import RatingStars from '../../components/RatingStars';
import ReviewModal from '../../components/ReviewModal';
import ReportModal from '../../components/ReportModal';
import ConfirmModal from '../../components/ConfirmModal';
import ResourceCard from '../../components/ResourceCard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [resource, setResource] = useState(null);
  const [meta, setMeta] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction Modals state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchResourceDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [resData, reviewData] = await Promise.all([
        api.get(`/resources/${id}`),
        api.get(`/reviews/${id}`)
      ]);

      if (resData.data.success) {
        setResource(resData.data.data);
        setMeta(resData.data.meta);
      }
      if (reviewData.data.success) {
        setReviews(reviewData.data.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load resource details');
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchResourceDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchResourceDetails]);

  // Bookmark Toggle
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      showError('Please login to bookmark resources');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/bookmarks/${resource._id}`);
      if (res.data.success) {
        setMeta((prev) => ({ ...prev, isBookmarked: res.data.isBookmarked }));
        setResource((prev) => ({ ...prev, bookmarks: res.data.bookmarksCount }));
        showSuccess(res.data.message);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to toggle bookmark');
    }
  };

  // Trigger download after confirmation
  const handleConfirmDownload = async () => {
    try {
      setDownloading(true);
      const res = await api.post(`/downloads/${resource._id}`);
      if (res.data.success) {
        showSuccess(`Download started! Remaining credits: ${res.data.currentCredits}`);
        setResource((prev) => ({ ...prev, downloads: res.data.downloadsCount }));
        refreshUser();
        setDownloadModalOpen(false);

        // Initiate browser download
        const downloadLink = document.createElement('a');
        downloadLink.href = res.data.fileUrl;
        downloadLink.download = res.data.fileName || 'study-notes.pdf';
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!isAuthenticated) {
      showInfo('Please login or create a free account to download study notes');
      navigate('/login');
      return;
    }

    const isUploader = user?._id === resource.uploadedBy?._id;
    const isAdmin = user?.role === 'admin';

    if (!isUploader && !isAdmin && (user?.credits || 0) < 1) {
      showError('You need at least 1 credit to download this resource. Upload your own notes to earn credits!');
      return;
    }

    setDownloadModalOpen(true);
  };

  const handleReviewSubmitted = (newReview, avgRating, ratingCount) => {
    setResource((prev) => ({ ...prev, averageRating: avgRating, ratingCount, reviewCount: ratingCount }));
    setMeta((prev) => ({ ...prev, userReview: newReview }));
    setReviews((prev) => {
      const filtered = prev.filter((r) => r.user?._id !== user?._id);
      return [newReview, ...filtered];
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-40 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-1/2 bg-slate-100 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Resource Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested study material does not exist or has been removed.</p>
        <Link to="/browse" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl">
          Browse Other Resources
        </Link>
      </div>
    );
  }

  const isUploader = user?._id === resource.uploadedBy?._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resources</span>
      </Link>

      {/* Main Resource Card & Details Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Status / Tags Top row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              {resource.category}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
              Semester {resource.semester}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
              {resource.resourceType}
            </span>
            {resource.status === 'pending' && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                Pending Admin Review
              </span>
            )}
            {resource.status === 'rejected' && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800">
                Rejected
              </span>
            )}
          </div>

          {/* Report Trigger */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                showError('Please login to submit a report');
                navigate('/login');
                return;
              }
              setReportModalOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Content</span>
          </button>
        </div>

        {/* Title and Course Information */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {resource.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              {resource.subject}
            </span>
            <span className="flex items-center gap-1.5">
              <School className="w-4 h-4 text-slate-400" />
              {resource.college || 'College/University'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(resource.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Metrics & Action Bar */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rating</span>
              <div className="flex items-center gap-2 mt-0.5">
                <RatingStars rating={resource.averageRating} size="md" showScore={true} />
                <span className="text-xs text-slate-400 font-medium">({resource.ratingCount} reviews)</span>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Downloads</span>
              <span className="text-lg font-bold text-slate-900">{resource.downloads || 0}</span>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">File Details</span>
              <span className="text-xs font-semibold text-slate-700">
                {resource.originalFileName || 'StudyMaterial.pdf'} ({resource.fileSize ? (resource.fileSize / (1024 * 1024)).toFixed(1) + ' MB' : 'PDF Document'})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-3 rounded-xl border font-semibold text-xs transition-all flex items-center gap-1.5 ${
                meta?.isBookmarked
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${meta?.isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">{meta?.isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            {/* Rate button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  showError('Please login to rate this resource');
                  navigate('/login');
                  return;
                }
                setReviewModalOpen(true);
              }}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>{meta?.userReview ? 'Edit Review' : 'Rate (1-5★)'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-800/60 text-[11px] font-bold text-emerald-100">
                {isUploader || isAdmin ? 'Free' : '-1 Credit'}
              </span>
            </button>
          </div>
        </div>

        {/* Rejection Banner if rejected */}
        {resource.status === 'rejected' && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
            <strong className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" /> Rejection Reason from Editorial Board:
            </strong>
            <p>{resource.rejectionReason || 'Content did not meet verification criteria.'}</p>
          </div>
        )}

        {/* Description Section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            About This Resource
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {resource.description}
          </p>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Topic Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/browse?search=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-medium text-slate-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column: Author Card + Document Preview / Review List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Author Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded By
            </h3>
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg text-indigo-700 shadow-xs">
                {resource.uploadedBy?.profileImage ? (
                  <img
                    src={resource.uploadedBy.profileImage}
                    alt={resource.uploadedBy.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  resource.uploadedBy?.name?.charAt(0) || 'S'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 text-base truncate">
                  {resource.uploadedBy?.name || 'Verified Student'}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {resource.uploadedBy?.department || 'Department'}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {resource.uploadedBy?.college || 'College'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Contributor Credits:</span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                {resource.uploadedBy?.credits || 50}
              </span>
            </div>
          </div>

          {/* Academic Verification Badge */}
          <div className="bg-emerald-50/70 rounded-3xl border border-emerald-200 p-5 space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Peer Resource</span>
            </div>
            <p className="text-emerald-800/80 leading-relaxed">
              This document has passed administrative quality and relevance moderation.
            </p>
          </div>
        </div>

        {/* Right Column: Reviews & Discussion */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Student Reviews & Feedback
                </h3>
                <p className="text-xs text-slate-500">
                  Based on {resource.ratingCount || 0} peer evaluations
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    showError('Please login to write a review');
                    navigate('/login');
                    return;
                  }
                  setReviewModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                {meta?.userReview ? 'Update Your Review' : '+ Add Review'}
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden font-bold text-xs flex items-center justify-center text-slate-700">
                          {rev.user?.profileImage ? (
                            <img src={rev.user.profileImage} alt={rev.user.name} className="w-full h-full object-cover" />
                          ) : (
                            rev.user?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.user?.name || 'Student Peer'}</p>
                          <p className="text-[10px] text-slate-400">
                            {rev.user?.college} • {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <RatingStars rating={rev.rating} size="sm" />
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-10">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No student reviews yet.</p>
                <p className="text-[11px] text-slate-400">Be the first to download and leave feedback on this resource!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Resources */}
      {meta?.relatedResources && meta.relatedResources.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-bold text-slate-900">
            Related Resources in {resource.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {meta.relatedResources.map((rel) => (
              <ResourceCard key={rel._id} resource={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        resourceId={resource._id}
        resourceTitle={resource.title}
        existingReview={meta?.userReview}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        resourceId={resource._id}
        resourceTitle={resource.title}
      />

      {/* Download Confirm Modal */}
      <ConfirmModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onConfirm={handleConfirmDownload}
        title="Download Academic Resource"
        message={
          isUploader || isAdmin
            ? `Download "${resource.title}" for free (Author access).`
            : `Downloading "${resource.title}" costs 1 Credit from your account balance (${user?.credits || 0} Credits available). Proceed?`
        }
        confirmText="Confirm & Download"
        type="primary"
        loading={downloading}
      />
    </div>
  );
};

export default ResourceDetails;

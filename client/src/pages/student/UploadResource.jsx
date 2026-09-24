import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const UploadResource = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: 'Data Structures',
    semester: user?.semester || 3,
    department: user?.department || 'Computer Science & Engineering',
    college: user?.college || 'University Institute of Technology',
    tags: '',
    resourceType: 'pdf',
    visibility: 'public'
  });

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Software Engineering',
    'Cyber Security',
    'Computer Engineering',
    'Mechanical Engineering',
    'Electrical Engineering'
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.data.length > 0) {
          setCategories(res.data.data);
          setFormData((prev) => ({ ...prev, category: res.data.data[0].name }));
        }
      } catch (err) {
        console.error('Failed to load categories for upload:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 50 * 1024 * 1024) {
        showError('File size exceeds maximum allowed 50MB limit.');
        return;
      }
      setFile(selected);

      // Auto deduce resource type
      const name = selected.name.toLowerCase();
      if (name.endsWith('.pdf')) setFormData((prev) => ({ ...prev, resourceType: 'pdf' }));
      else if (name.endsWith('.doc') || name.endsWith('.docx')) setFormData((prev) => ({ ...prev, resourceType: 'doc' }));
      else if (name.endsWith('.ppt') || name.endsWith('.pptx')) setFormData((prev) => ({ ...prev, resourceType: 'ppt' }));
      else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) setFormData((prev) => ({ ...prev, resourceType: 'image' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showError('Please attach a study resource document (PDF, DOC, PPT or Image).');
      return;
    }

    if (!formData.title || !formData.description || !formData.subject) {
      showError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('file', file);
      if (thumbnail) data.append('thumbnail', thumbnail);

      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });

      const res = await api.post('/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showSuccess('Resource uploaded successfully! It is now pending admin review for your +10 credit reward.');
        refreshUser();
        navigate('/my-resources');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Earn +10 Credits Upon Admin Approval</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Upload Academic Resource
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200">
          Share handwritten notes, solved papers, lab manuals, or formula cheat sheets to help fellow college students.
        </p>
      </div>

      {/* Workflow Explanation Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block mb-0.5">Verification & Approval Lifecycle:</strong>
          <span>
            Every uploaded resource begins in <strong>PENDING</strong> status. Once verified by our editorial admin team for academic relevance and clarity, it becomes publicly discoverable and <strong>+10 credits</strong> will be instantly added to your ledger!
          </span>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* File Drag & Drop Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Resource Document File * (PDF, DOCX, PPTX, Images up to 50MB)
          </label>
          <div className="relative border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-6 text-center bg-indigo-50/40 hover:bg-indigo-50 transition-all cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-xs text-indigo-600 font-semibold">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop your study file here
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports high-resolution PDF, Word, PowerPoint, and handwritten scans
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Resource Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., DBMS Complete Handwritten Module Notes with BCNF and SQL Examples"
            className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            required
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what topics are covered, unit numbers, whether it has diagrams or solved questions..."
            className="w-full text-sm rounded-xl border border-slate-200 p-3.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            required
            maxLength={3000}
          />
        </div>

        {/* 2-Columns: Subject & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject / Course Code *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Database Management Systems (CS301)"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Academic Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            >
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3-Columns: Semester, Department, Format */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Semester *
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Resource Format
            </label>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 uppercase"
            >
              <option value="pdf">PDF Document</option>
              <option value="doc">Word (DOC / DOCX)</option>
              <option value="ppt">PowerPoint (PPT)</option>
              <option value="image">Scanned Image</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Tags & College */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. Normalization, SQL, B+ Trees, ACID"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College / University
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. IIT Delhi"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Moderation Queue...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Submit Resource for Approval</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadResource;

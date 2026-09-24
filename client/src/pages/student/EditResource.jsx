import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, Loader2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: '',
    semester: 1,
    department: '',
    college: '',
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, resData] = await Promise.all([
          api.get('/categories'),
          api.get(`/resources/${id}`)
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (resData.data.success) {
          const r = resData.data.data;
          setFormData({
            title: r.title || '',
            description: r.description || '',
            subject: r.subject || '',
            category: r.category || '',
            semester: r.semester || 1,
            department: r.department || '',
            college: r.college || '',
            tags: r.tags ? r.tags.join(', ') : '',
            resourceType: r.resourceType || 'pdf',
            visibility: r.visibility || 'public'
          });
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put(`/resources/${id}`, formData);
      if (res.data.success) {
        showSuccess('Resource updated successfully');
        navigate('/my-resources');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Go Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Edit Resource Details</h2>
          <p className="text-xs text-slate-500">Update metadata and course categorization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
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
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
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
                Format
              </label>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white uppercase"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Word DOC</option>
                <option value="ppt">PowerPoint PPT</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResource;

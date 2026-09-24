import React, { useState } from 'react';
import { User, School, GraduationCap, Mail, Sparkles, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || 1,
    bio: user?.bio || '',
    profileImage: user?.profileImage || ''
  });
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      showSuccess('Profile information saved successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Student Profile & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your student identity, college department affiliation, and public bio.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt={formData.name} className="w-full h-full object-cover" />
            ) : (
              formData.name?.charAt(0) || 'S'
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email} • {user?.role?.toUpperCase()}</p>
            <div className="text-xs font-semibold text-amber-800">
              Current Balance: {user?.credits} Credits
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Profile Photo URL
            </label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              About / Academic Bio
            </label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Share what subjects you're focusing on and the type of notes you contribute..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white font-medium text-slate-900"
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white font-medium"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

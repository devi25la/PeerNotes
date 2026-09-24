import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Coins,
  Shield,
  Trash2,
  PlusCircle,
  X,
  Loader2
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ManageUsers = () => {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Credit adjustment modal state
  const [creditModalUser, setCreditModalUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(10);
  const [creditReason, setCreditReason] = useState('Special contest bonus');
  const [adjusting, setAdjusting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        role: roleFilter,
        status: statusFilter
      };
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (targetUser) => {
    try {
      const res = await api.put(`/admin/users/${targetUser._id}/toggle-status`);
      if (res.data.success) {
        showSuccess(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, isActive: res.data.data.isActive } : u))
        );
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleCreditAdjustmentSubmit = async (e) => {
    e.preventDefault();
    try {
      setAdjusting(true);
      const res = await api.post(`/admin/users/${creditModalUser._id}/credits`, {
        amount: Number(creditAmount),
        reason: creditReason
      });
      if (res.data.success) {
        showSuccess(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === creditModalUser._id ? { ...u, credits: res.data.data.credits } : u))
        );
        setCreditModalUser(null);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Credit adjustment failed');
    } finally {
      setAdjusting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/admin/users/${deleteTarget._id}`);
      if (res.data.success) {
        showSuccess('User account removed');
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Student & User Management</h1>
        <p className="text-xs text-slate-500">
          Search students, oversee credit allocations, and toggle account activation status.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, email, or college..."
            className="w-full text-xs rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Student / User</th>
                  <th className="px-5 py-3.5">Affiliation</th>
                  <th className="px-5 py-3.5">Uploads</th>
                  <th className="px-5 py-3.5">Credits</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center overflow-hidden shrink-0">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 truncate max-w-xs">{u.college}</p>
                      <p className="text-[10px] text-slate-400">{u.department} (Sem {u.semester})</p>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-700">
                      <span>{u.approvedCount || 0} approved</span>
                      <span className="text-[10px] text-slate-400 block">of {u.uploadsCount || 0} total</span>
                    </td>

                    <td className="px-5 py-4 font-extrabold text-amber-800">
                      <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span>{u.credits}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Adjust Credits Button */}
                        <button
                          type="button"
                          onClick={() => setCreditModalUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors"
                          title="Adjust student credits"
                        >
                          ± Credits
                        </button>

                        {/* Toggle Active / Deactive */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`p-1.5 rounded-lg text-xs font-semibold ${
                            u.isActive
                              ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={u.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {u.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        {/* Delete User */}
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No users matching query.
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Adjust Credits Modal */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Adjust Student Credits</h3>
              <button onClick={() => setCreditModalUser(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Student: <strong className="text-slate-900">{creditModalUser.name}</strong> (Current Balance: {creditModalUser.credits} Credits)
            </p>

            <form onSubmit={handleCreditAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Amount (+ve to award, -ve to deduct)
                </label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full text-sm font-bold rounded-xl border border-slate-200 p-2.5 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Adjustment Reason / Description
                </label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="e.g. Peer contributor bounty"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreditModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to delete ${deleteTarget?.name}'s account and invalidate their login?`}
        confirmText="Yes, Delete User"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ManageUsers;

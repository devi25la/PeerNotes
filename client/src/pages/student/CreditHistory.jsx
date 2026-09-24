import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coins, Sparkles, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Upload } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const CreditHistory = () => {
  const { user } = useAuth();
  const { showError } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(user?.credits || 0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/credits/history?page=${page}&limit=12`);
      if (res.data.success) {
        setTransactions(res.data.data);
        setBalance(res.data.currentBalance);
        setTotalEarned(res.data.totalEarned);
        setTotalSpent(res.data.totalSpent);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch credit ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [page]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Credit Ledger</h1>
          <p className="text-xs text-slate-500">
            Immutable transaction history of all credits earned from uploads & spent on downloads.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Notes (+10 Credits)</span>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-tr from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Current Balance</span>
            <div className="p-2 rounded-xl bg-white/20">
              <Coins className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black">{balance}</div>
          <p className="text-xs text-amber-100 font-medium">Ready for downloading peer study resources</p>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Credits Earned</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">+{totalEarned}</div>
          <p className="text-xs text-slate-400">From approvals, milestones & signup</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Credits Spent</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">-{totalSpent}</div>
          <p className="text-xs text-slate-400">Used across resource downloads</p>
        </div>
      </div>

      {/* Credit Rules Cheat-Sheet */}
      <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Credit System Rules & Reward Formulas</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-xs">
            <span className="font-extrabold text-emerald-600 block text-base">+10</span>
            <span className="font-bold text-slate-800 block">Approved Upload</span>
            <span className="text-[10px] text-slate-400">Verified by Admin</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-xs">
            <span className="font-extrabold text-emerald-600 block text-base">+5</span>
            <span className="font-bold text-slate-800 block">10-Download Hit</span>
            <span className="text-[10px] text-slate-400">Every 10 downloads</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-xs">
            <span className="font-extrabold text-emerald-600 block text-base">+3</span>
            <span className="font-bold text-slate-800 block">5 Positive Ratings</span>
            <span className="text-[10px] text-slate-400">Rating 4★ or 5★</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-xs">
            <span className="font-extrabold text-rose-600 block text-base">-1</span>
            <span className="font-bold text-slate-800 block">Per Download</span>
            <span className="text-[10px] text-slate-400">Authors download free</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-0">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-sm text-slate-900">
          Transaction History
        </div>

        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx._id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{tx.description}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-black ${
                      tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Balance: {tx.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No transaction records found.
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default CreditHistory;

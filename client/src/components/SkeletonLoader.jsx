import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 rounded-md"></div>
        <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-4 w-24 bg-slate-200 rounded-sm"></div>
      <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
      <div className="h-4 w-full bg-slate-100 rounded-sm"></div>
      <div className="h-4 w-2/3 bg-slate-100 rounded-sm"></div>
      <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-slate-200"></div>
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-28 bg-slate-200 rounded-sm"></div>
          <div className="h-2.5 w-20 bg-slate-100 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-14 bg-slate-100/80 rounded-xl"></div>
      ))}
    </div>
  );
};

import React from 'react';
import { Coins, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreditBadge = ({ credits = 0, showLink = true, size = 'md' }) => {
  const badgeContent = (
    <div
      className={`inline-flex items-center gap-1.5 font-semibold transition-all duration-200 ${
        size === 'sm'
          ? 'px-2.5 py-1 text-xs rounded-full'
          : size === 'lg'
          ? 'px-4 py-2 text-base rounded-2xl'
          : 'px-3 py-1.5 text-sm rounded-xl'
      } bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-emerald-500/10 text-amber-900 border border-amber-300/60 shadow-xs hover:border-amber-400`}
    >
      <div className="flex items-center justify-center rounded-full bg-amber-500 text-white p-0.5 shadow-xs">
        <Coins className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
      </div>
      <span className="font-bold tracking-tight text-amber-900">{credits}</span>
      <span className="text-amber-700/80 text-xs hidden sm:inline font-medium">credits</span>
    </div>
  );

  if (showLink) {
    return (
      <Link to="/credits" title="View Credit Balance & History" className="hover:scale-105 active:scale-95 transition-transform">
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
};

export default CreditBadge;

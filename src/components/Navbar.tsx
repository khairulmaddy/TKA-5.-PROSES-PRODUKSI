import React from 'react';
import { ShieldCheck, Timer, KeyRound, LogOut, BookOpen } from 'lucide-react';
import { formatSeconds } from '../utils/storage';

interface NavbarProps {
  studentName?: string;
  studentClass?: string;
  subject?: string;
  elapsedSeconds?: number;
  isExamActive?: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onAdminLogout: () => void;
  onReturnToCover?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  studentClass,
  elapsedSeconds = 0,
  isExamActive = false,
  isAdminLoggedIn,
  onOpenAdminModal,
  onAdminLogout,
  onReturnToCover,
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-sm shrink-0">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onReturnToCover}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            PK
          </div>
          <div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-indigo-900 block leading-tight">
              PKK Exam <span className="text-indigo-400 font-normal">v2.0</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Produk Kreatif dan Kewirausahaan
            </p>
          </div>
        </div>

        {/* Center: Live Timer or Student Info */}
        {isExamActive ? (
          <div className="flex flex-col items-end sm:items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold hidden sm:block">Waktu Berjalan</span>
            <div className="flex items-center space-x-2 bg-indigo-50 px-3.5 py-1 rounded-xl border border-indigo-100">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono font-bold text-lg sm:text-2xl text-slate-700">
                {formatSeconds(elapsedSeconds)}
              </span>
            </div>
          </div>
        ) : studentName ? (
          <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-3.5 py-1.5 rounded-full text-xs border border-indigo-100">
            <span className="font-bold text-indigo-900">{studentName}</span>
            <span className="text-indigo-300">•</span>
            <span className="text-indigo-600 font-medium">{studentClass}</span>
          </div>
        ) : null}

        {/* Right: Admin Controls */}
        <div className="flex items-center gap-2">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin Panel
              </span>
              <button
                onClick={onAdminLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                title="Keluar dari Admin"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="bg-amber-100 text-amber-700 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border-2 border-amber-200 hover:bg-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Admin 🔑</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

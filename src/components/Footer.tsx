import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-200 bg-white/80 backdrop-blur-md text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="font-semibold text-sm sm:text-base tracking-wide text-slate-800 dark:text-slate-200">
          Copywrite by Khairul Maddy
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          Aplikasi Ujian & Evaluasi Pembelajaran Produk Kreatif dan Kewirausahaan
        </p>
      </div>
    </footer>
  );
};

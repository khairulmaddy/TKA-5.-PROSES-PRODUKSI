import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, Award, Clock } from 'lucide-react';
import { getStudentAttempts, formatSeconds } from '../utils/storage';
import { StudentSubmission } from '../types';

interface CoverScreenProps {
  onStartExam: (name: string, studentClass: string, attemptNumber: number) => void;
  initialName?: string;
  initialClass?: string;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  onStartExam,
  initialName = '',
  initialClass = '',
}) => {
  const [name, setName] = useState(initialName);
  const [studentClass, setStudentClass] = useState(initialClass || '');
  const [previousAttempts, setPreviousAttempts] = useState<StudentSubmission[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Class preset options
  const classPresets = [
    'XII RPL 1', 'XII RPL 2',
    'XII TKJ 1', 'XII TKJ 2',
    'XII TKR 1', 'XII TKR 2',
    'XII OTKP 1', 'XII OTKP 2',
    'XII BDP 1', 'XII BDP 2',
    'Lainnya (Ketik Sendiri)',
  ];

  useEffect(() => {
    if (name.trim()) {
      const attempts = getStudentAttempts(name.trim());
      setPreviousAttempts(attempts);

      // Auto set target attempt
      if (attempts.length === 0) {
        setSelectedAttempt(1);
      } else if (attempts.length === 1) {
        setSelectedAttempt(2);
      } else if (attempts.length === 2) {
        setSelectedAttempt(3);
      } else {
        setSelectedAttempt(3); // capped at 3
      }
    } else {
      setPreviousAttempts([]);
      setSelectedAttempt(1);
    }
  }, [name]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Harap masukkan Nama Lengkap Anda terlebih dahulu.');
      return;
    }

    const finalClass = studentClass.trim();
    if (!finalClass) {
      setErrorMsg('Harap isi Kelas Anda.');
      return;
    }

    if (previousAttempts.length >= 3) {
      setErrorMsg('Anda telah menggunakan seluruh 3 batas kesempatan ujian.');
      return;
    }

    setErrorMsg('');
    const targetAttempt = previousAttempts.length + 1;
    onStartExam(name.trim(), finalClass, targetAttempt);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-8 overflow-hidden bg-slate-50">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 -z-10 bg-slate-50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative z-10"
      >
        {/* Animated Badge Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Sistem Evaluasi Digital Produk Kreatif dan Kewirausahaan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight leading-snug">
            LEMBAR UJIAN SISWA
          </h1>

          <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">
            Silakan lengkapi identitas Anda di bawah ini untuk memulai pelaksanaan ujian online.
          </p>
        </div>

        {/* Identity Form */}
        <form onSubmit={handleStart} className="space-y-5">
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            {/* Nama Siswa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-semibold text-base focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Kelas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-semibold text-base focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>

            {/* Mata Pelajaran (Pre-filled as requested) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Mata Pelajaran
              </label>
              <div className="w-full px-4 py-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-indigo-900 font-bold text-base flex items-center justify-between">
                <span>Produk Kreatif dan Kewirausahaan</span>
                <span className="text-xs bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg">
                  40 Soal
                </span>
              </div>
            </div>
          </div>

          {/* Previous Attempts Status */}
          {name.trim() && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Riwayat Kesempatan Siswa
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                  {previousAttempts.length} / 3 Digunakan
                </span>
              </div>

              {previousAttempts.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Ini adalah <strong>Kesempatan Ke-1</strong> Anda. Pembahasan dan kunci jawaban akan ditampilkan setelah selesai.
                  </span>
                </div>
              ) : previousAttempts.length === 1 ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 flex justify-between items-center">
                    <span>Kesempatan 1: <strong className="text-indigo-600">Skor {previousAttempts[0].score}</strong> ({previousAttempts[0].correctCount} Benar)</span>
                    <span className="text-slate-500 font-mono"><Clock className="w-3 h-3 inline mr-1"/>{formatSeconds(previousAttempts[0].durationSeconds)}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Ini adalah <strong>Kesempatan Ke-2</strong> Anda. Pembahasan dan kunci jawaban masih akan ditampilkan setelah selesai.
                    </span>
                  </div>
                </div>
              ) : previousAttempts.length === 2 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700">
                      Ke-1: <strong className="text-indigo-600">Skor {previousAttempts[0].score}</strong>
                    </div>
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700">
                      Ke-2: <strong className="text-indigo-600">Skor {previousAttempts[1].score}</strong>
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-950">Kategori Ujian Acak (Kesempatan Ke-3 / Terakhir):</strong>
                      <span>Urutan soal & opsi jawaban akan <strong>DIAJAK SECARA OTOMATIS</strong>. Hanya menampilkan Hasil Akhir (Jumlah Benar & Salah).</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Batas maksimum 3 kesempatan telah digunakan oleh siswa ini. Silakan hubungi Admin.
                  </span>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={previousAttempts.length >= 3}
            className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-lg shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Mulai Ujian ({`Kesempatan Ke-${Math.min(previousAttempts.length + 1, 3)}`})</span>
          </button>
        </form>

        {/* Info Rules Box */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-indigo-900 block mb-0.5">⏱️ Waktu Ditercatat</span>
            <span>Stopwatch mencatat durasi pengerjaan Anda secara real-time.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-indigo-900 block mb-0.5">📝 40 Soal Pilihan</span>
            <span>Variasi Soal PG, Menjodohkan, Benar/Salah, & PG Kompleks.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-indigo-900 block mb-0.5">🔑 Rekapitulasi Admin</span>
            <span>Nilai langsung tersimpan otomatis di database sekolah.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

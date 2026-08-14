import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, BookOpen, Home, Sparkles } from 'lucide-react';
import { formatSeconds } from '../utils/storage';
import { StudentSubmission } from '../types';

interface ResultScreenProps {
  submission: StudentSubmission;
  onReviewAnswers: () => void;
  onRepeatExam: () => void;
  onReturnToCover: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  submission,
  onReviewAnswers,
  onRepeatExam,
  onReturnToCover,
}) => {
  useEffect(() => {
    if (submission.score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [submission.score]);

  const isPassed = submission.score >= 75;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Result Card Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-slate-800 text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hasil Ujian — Kesempatan Ke-{submission.attemptNumber}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight">
            {submission.studentName}
          </h2>

          <p className="text-sm text-slate-500 font-medium">
            Kelas: <strong className="text-slate-800">{submission.studentClass}</strong> • Mata Pelajaran: <strong className="text-slate-800">{submission.subject}</strong>
          </p>

          {/* Score Gauge Circle */}
          <div className="pt-4 pb-2">
            <div className={`w-36 h-36 mx-auto rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-transform hover:scale-105 ${
              isPassed
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-100'
                : 'bg-amber-50 border-amber-500 text-amber-900 shadow-amber-100'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NILAI AKHIR</span>
              <span className="text-4xl font-extrabold font-mono tracking-tight">{submission.score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">DARI 100</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-sm sm:text-base font-medium">
            {isPassed ? (
              <p className="text-emerald-700 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Selamat! Anda telah mencapai Kriteria Ketuntasan Minimal.
              </p>
            ) : (
              <p className="text-amber-800 font-bold">
                Tetap semangat! Nilai Anda berada di bawah KKM (75).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Jawaban Benar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Jawaban Benar
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono">
            {submission.correctCount}
          </span>
        </div>

        {/* Jawaban Salah */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-md">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Jawaban Salah
          </span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono">
            {submission.wrongCount}
          </span>
        </div>

        {/* Durasi Pengerjaan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Durasi
          </span>
          <span className="text-2xl font-extrabold text-indigo-600 font-mono">
            {formatSeconds(submission.durationSeconds)}
          </span>
        </div>

        {/* Total Soal */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Soal
          </span>
          <span className="text-2xl font-extrabold text-purple-600 font-mono">
            {submission.totalQuestions}
          </span>
        </div>
      </div>

      {/* Action Buttons Depending on Attempt Number */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
        {submission.attemptNumber < 3 ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 text-center font-medium">
              Karena ini adalah Kesempatan Ke-{submission.attemptNumber}, Anda dapat meninjau kunci jawaban & pembahasan lengkap soal untuk evaluasi belajar.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onReviewAnswers}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lihat Pembahasan & Kunci Jawaban</span>
              </button>

              <button
                onClick={onRepeatExam}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Ujian (Kesempatan Ke-{submission.attemptNumber + 1})</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium">
              <strong className="block text-amber-950 mb-1">Pemberitahuan Kesempatan Terakhir:</strong>
              <span>Anda telah menyelesaikan kesempatan ujian terakhir (Kesempatan Ke-3). Hasil skor, total benar ({submission.correctCount}), dan salah ({submission.wrongCount}) telah terekam secara otomatis ke database admin.</span>
            </div>
          </div>
        )}

        <button
          onClick={onReturnToCover}
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Halaman Depan</span>
        </button>
      </div>
    </div>
  );
};

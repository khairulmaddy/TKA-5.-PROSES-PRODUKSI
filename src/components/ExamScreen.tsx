import React, { useState, useEffect } from 'react';
import { Question, AnswerState } from '../types';
import { QuestionCard } from './QuestionCard';
import { ChevronLeft, ChevronRight, Grid, CheckCircle2, AlertCircle, Send, Bookmark } from 'lucide-react';

interface ExamScreenProps {
  studentName: string;
  studentClass: string;
  attemptNumber: number;
  questions: Question[];
  elapsedSeconds: number;
  onFinishExam: (answers: AnswerState) => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  studentName,
  studentClass,
  attemptNumber,
  questions,
  onFinishExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({
    pgAnswers: {},
    matchingAnswers: {},
    complexAnswers: {},
  });

  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showGridDrawer, setShowGridDrawer] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Helper to check if a specific question is answered
  const isQuestionAnswered = (q: Question): boolean => {
    if (q.type === 'PG' || q.type === 'TRUE_FALSE') {
      return Boolean(answers.pgAnswers[q.id]);
    } else if (q.type === 'MATCHING') {
      const pairs = answers.matchingAnswers[q.id];
      if (!pairs) return false;
      return Object.keys(pairs).length >= q.items.length;
    } else if (q.type === 'COMPLEX_PG') {
      const list = answers.complexAnswers[q.id];
      return Boolean(list && list.length > 0);
    }
    return false;
  };

  const answeredCount = questions.filter((q) => isQuestionAnswered(q)).length;
  const totalCount = questions.length;

  // Handlers for updating answers
  const handleAnswerPG = (key: string) => {
    setAnswers((prev) => ({
      ...prev,
      pgAnswers: { ...prev.pgAnswers, [currentQuestion.id]: key },
    }));
  };

  const handleAnswerMatching = (itemId: number, optionKey: string) => {
    setAnswers((prev) => {
      const existing = prev.matchingAnswers[currentQuestion.id] || {};
      const updated = { ...existing };
      if (!optionKey) {
        delete updated[itemId];
      } else {
        updated[itemId] = optionKey;
      }
      return {
        ...prev,
        matchingAnswers: { ...prev.matchingAnswers, [currentQuestion.id]: updated },
      };
    });
  };

  const handleAnswerComplex = (key: string) => {
    setAnswers((prev) => {
      const existing = prev.complexAnswers[currentQuestion.id] || [];
      const updated = existing.includes(key)
        ? existing.filter((k) => k !== key)
        : [...existing, key];
      return {
        ...prev,
        complexAnswers: { ...prev.complexAnswers, [currentQuestion.id]: updated },
      };
    });
  };

  const toggleMarkReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Question Navigation Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white">
              Kesempatan Ke-{attemptNumber}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Siswa: <strong className="text-slate-900">{studentName}</strong> ({studentClass})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Terjawab: <strong className="text-emerald-600 font-bold">{answeredCount}</strong> dari {totalCount} Soal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGridDrawer(!showGridDrawer)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
          >
            <Grid className="w-4 h-4 text-indigo-600" />
            <span>Navigasi Soal (1–40)</span>
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-200 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Selesai Ujian</span>
          </button>
        </div>
      </div>

      {/* Grid Drawer for Question Quick Jump */}
      {showGridDrawer && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Daftar Nomor Soal</span>
            <div className="flex items-center gap-4 text-slate-500 font-semibold normal-case">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"/> Terjawab</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500 inline-block"/> Ragu-ragu</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-slate-200 inline-block"/> Belum</span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
            {questions.map((q, idx) => {
              const isAns = isQuestionAnswered(q);
              const isMarked = markedForReview[q.id];
              const isCurrent = idx === currentIndex;

              let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
              if (isAns) btnClass = 'bg-emerald-500 text-white font-bold shadow-sm';
              if (isMarked) btnClass = 'bg-amber-500 text-white font-bold shadow-sm';
              if (isCurrent) btnClass = 'bg-indigo-600 text-white font-extrabold ring-4 ring-indigo-100 shadow-md';

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowGridDrawer(false);
                  }}
                  className={`py-2.5 text-xs rounded-xl transition-all cursor-pointer font-bold ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Active Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        userAnswerPG={answers.pgAnswers[currentQuestion.id]}
        userAnswerMatching={answers.matchingAnswers[currentQuestion.id]}
        userAnswerComplex={answers.complexAnswers[currentQuestion.id]}
        onAnswerPG={handleAnswerPG}
        onAnswerMatching={handleAnswerMatching}
        onAnswerComplex={handleAnswerComplex}
        reviewMode={false}
      />

      {/* Bottom Controls Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={toggleMarkReview}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
            markedForReview[currentQuestion.id]
              ? 'bg-amber-50 border-amber-400 text-amber-900'
              : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${markedForReview[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{markedForReview[currentQuestion.id] ? 'Ditandai Ragu-Ragu' : 'Tandai Ragu-Ragu'}</span>
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Kirim Jawaban</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-slate-800 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-indigo-950">Konfirmasi Pengiriman Ujian</h3>
              <p className="text-sm text-slate-600">
                Anda telah menjawab <strong className="text-emerald-600">{answeredCount}</strong> dari <strong className="text-indigo-900">{totalCount}</strong> soal.
              </p>
              {answeredCount < totalCount && (
                <p className="text-xs text-rose-700 font-bold bg-rose-50 p-3 rounded-2xl border border-rose-200">
                  ⚠️ Masih ada {totalCount - answeredCount} soal yang belum Anda jawab!
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Kembali Periksa
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onFinishExam(answers);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-colors cursor-pointer"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Question, StudentSubmission } from '../types';
import { QuestionCard } from './QuestionCard';
import { ArrowLeft, CheckCircle2, XCircle, Filter } from 'lucide-react';

interface ReviewScreenProps {
  submission: StudentSubmission;
  questions: Question[];
  onBackToResult: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  submission,
  questions,
  onBackToResult,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CORRECT' | 'WRONG'>('ALL');

  // Map question correctness
  const isQuestionCorrect = (q: Question): boolean => {
    if (q.type === 'PG' || q.type === 'TRUE_FALSE') {
      const selected = submission.userAnswers.pgAnswers[q.id];
      return selected === q.correctKey;
    } else if (q.type === 'MATCHING') {
      const pairs = submission.userAnswers.matchingAnswers[q.id] || {};
      const total = q.items.length;
      let count = 0;
      q.items.forEach((item) => {
        if (pairs[item.id] === q.correctPairs[item.id]) count++;
      });
      return count === total && total > 0;
    } else if (q.type === 'COMPLEX_PG') {
      const selectedList = submission.userAnswers.complexAnswers[q.id] || [];
      const correctSorted = [...q.correctKeys].sort().join(',');
      const selectedSorted = [...selectedList].sort().join(',');
      return selectedSorted === correctSorted;
    }
    return false;
  };

  const filteredQuestions = questions.filter((q) => {
    const correct = isQuestionCorrect(q);
    if (filter === 'CORRECT') return correct;
    if (filter === 'WRONG') return !correct;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Review Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <button
            onClick={onBackToResult}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Ringkasan Hasil
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-950">
            Pembahasan & Evaluasi Jawaban ({submission.studentName})
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Menampilkan {filteredQuestions.length} Soal • Kesempatan Ke-{submission.attemptNumber}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({questions.length})
          </button>

          <button
            onClick={() => setFilter('CORRECT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              filter === 'CORRECT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Benar ({submission.correctCount})
          </button>

          <button
            onClick={() => setFilter('WRONG')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              filter === 'WRONG'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" /> Salah ({submission.wrongCount})
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionNumber={questions.findIndex((orig) => orig.id === q.id) + 1}
            userAnswerPG={submission.userAnswers.pgAnswers[q.id]}
            userAnswerMatching={submission.userAnswers.matchingAnswers[q.id]}
            userAnswerComplex={submission.userAnswers.complexAnswers[q.id]}
            onAnswerPG={() => {}}
            onAnswerMatching={() => {}}
            onAnswerComplex={() => {}}
            reviewMode={true}
            showPembahasan={true}
          />
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Question, QuestionPG, QuestionMatching, QuestionTrueFalse, QuestionComplexPG } from '../types';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number; // 1 to 40
  userAnswerPG?: string;
  userAnswerMatching?: Record<number, string>;
  userAnswerComplex?: string[];
  onAnswerPG: (key: string) => void;
  onAnswerMatching: (itemId: number, optionKey: string) => void;
  onAnswerComplex: (key: string) => void;
  reviewMode?: boolean;
  showPembahasan?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  userAnswerPG,
  userAnswerMatching = {},
  userAnswerComplex = [],
  onAnswerPG,
  onAnswerMatching,
  onAnswerComplex,
  reviewMode = false,
  showPembahasan = true,
}) => {
  // Render Bloom Taxonomy badge
  const renderBloomBadge = () => {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase">
        {question.bloom}
      </span>
    );
  };

  // Render PG or True False Options
  const renderPGOptions = (
    options: { key: string; text: string }[],
    selectedKey?: string,
    correctKey?: string
  ) => {
    return (
      <div className="space-y-3 mt-6">
        {options.map((opt) => {
          const isSelected = selectedKey === opt.key;
          const isCorrectKey = correctKey === opt.key;

          let optionStyle =
            'border-2 border-slate-100 bg-white hover:border-indigo-300 text-slate-600 font-medium';
          let badgeStyle =
            'bg-slate-100 group-hover:bg-indigo-100 text-slate-700 font-bold';

          if (reviewMode) {
            if (isCorrectKey) {
              optionStyle =
                'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
              badgeStyle = 'bg-emerald-600 text-white font-bold';
            } else if (isSelected && !isCorrectKey) {
              optionStyle =
                'border-2 border-rose-400 bg-rose-50 text-rose-950 line-through opacity-90';
              badgeStyle = 'bg-rose-600 text-white font-bold';
            } else {
              optionStyle = 'border-2 border-slate-100 bg-slate-50 text-slate-400';
              badgeStyle = 'bg-slate-200 text-slate-500';
            }
          } else if (isSelected) {
            optionStyle =
              'border-2 border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm';
            badgeStyle = 'bg-indigo-600 text-white font-bold shadow-md';
          }

          return (
            <button
              key={opt.key}
              disabled={reviewMode}
              onClick={() => onAnswerPG(opt.key)}
              className={`group w-full text-left p-4 rounded-2xl transition-all flex items-center cursor-pointer ${optionStyle}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-4 shrink-0 transition-colors ${badgeStyle}`}
              >
                {opt.key}
              </div>
              <span className="text-base leading-relaxed break-words">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // Render Matching (Menjodohkan)
  const renderMatching = (q: QuestionMatching) => {
    return (
      <div className="space-y-6 mt-6">
        {/* Helper Instructions */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 font-semibold">
          💡 Pasangkan setiap pernyataan (1–5) dengan pilihan yang paling tepat (A–E).
        </div>

        {/* List of items */}
        <div className="space-y-4">
          {q.items.map((item) => {
            const currentSelected = userAnswerMatching[item.id] || '';
            const correctOptKey = q.correctPairs[item.id];
            const isItemCorrect = currentSelected === correctOptKey;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/80 space-y-3"
              >
                <div className="text-base font-semibold text-slate-800">
                  {item.text}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Pilih Pasangan:
                  </label>
                  <select
                    disabled={reviewMode}
                    value={currentSelected}
                    onChange={(e) => onAnswerMatching(item.id, e.target.value)}
                    className="flex-1 min-w-[200px] px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
                  >
                    <option value="">-- Pilih Jawaban --</option>
                    {q.options.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.text}
                      </option>
                    ))}
                  </select>

                  {reviewMode && (
                    <div className="flex items-center gap-2">
                      {isItemCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Benar ({correctOptKey})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200">
                          <XCircle className="w-4 h-4 text-rose-600" /> Kunci: {correctOptKey}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Options Legend */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs sm:text-sm">
          <p className="font-bold text-indigo-900">Daftar Pilihan Pasangan:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
            {q.options.map((opt) => (
              <li key={opt.key} className="p-2 rounded-xl bg-white border border-indigo-100 shadow-sm">
                <strong className="text-indigo-600">{opt.key}:</strong> {opt.text.replace(/^[A-E]\.\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Render Complex PG (Checkboxes)
  const renderComplexPG = (q: QuestionComplexPG) => {
    return (
      <div className="space-y-3 mt-6">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs sm:text-sm text-indigo-900 font-semibold">
          ☑️ Pilihan Ganda Kompleks: Anda dapat memilih <strong>lebih dari satu jawaban benar</strong>.
        </div>

        {q.options.map((opt) => {
          const isChecked = userAnswerComplex.includes(opt.key);
          const isCorrect = q.correctKeys.includes(opt.key);

          let optionStyle =
            'border-2 border-slate-100 bg-white hover:border-indigo-300 text-slate-600 font-medium';

          if (reviewMode) {
            if (isCorrect) {
              optionStyle =
                'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
            } else if (isChecked && !isCorrect) {
              optionStyle =
                'border-2 border-rose-400 bg-rose-50 text-rose-950 line-through opacity-90';
            } else {
              optionStyle = 'border-2 border-slate-100 bg-slate-50 text-slate-400';
            }
          } else if (isChecked) {
            optionStyle =
              'border-2 border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm';
          }

          return (
            <button
              key={opt.key}
              disabled={reviewMode}
              onClick={() => onAnswerComplex(opt.key)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 cursor-pointer ${optionStyle}`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isChecked && <span className="text-xs font-bold">✓</span>}
              </div>

              <span className="text-base leading-relaxed break-words">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative">
      {/* Top Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <span className="text-indigo-600 font-bold text-sm">
          Pertanyaan No. {questionNumber}
        </span>
        <div>{renderBloomBadge()}</div>
      </div>

      {/* Question Text */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
        {question.questionText}
      </h2>

      {/* True False statement matrix preview if available */}
      {question.type === 'TRUE_FALSE' && (question as QuestionTrueFalse).statements && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pernyataan Evaluasi:
          </p>
          <ul className="space-y-1.5 text-sm font-medium text-slate-800">
            {(question as QuestionTrueFalse).statements?.map((s) => (
              <li key={s.id} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Answer Options Body */}
      {question.type === 'PG' && renderPGOptions((question as QuestionPG).options, userAnswerPG, (question as QuestionPG).correctKey)}
      {question.type === 'TRUE_FALSE' && renderPGOptions((question as QuestionTrueFalse).options, userAnswerPG, (question as QuestionTrueFalse).correctKey)}
      {question.type === 'MATCHING' && renderMatching(question as QuestionMatching)}
      {question.type === 'COMPLEX_PG' && renderComplexPG(question as QuestionComplexPG)}

      {/* Review Mode Pembahasan Box */}
      {reviewMode && showPembahasan && question.pembahasan && (
        <div className="mt-8 bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-5 flex items-start">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 mr-4 shadow-lg shadow-emerald-200">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <p className="text-emerald-900 font-bold text-sm uppercase tracking-tight mb-1">
              Pembahasan & Kunci Jawaban
            </p>
            <p className="text-emerald-700 text-sm leading-relaxed">
              {question.pembahasan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

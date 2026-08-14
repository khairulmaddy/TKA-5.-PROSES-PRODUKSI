import { AnswerState, Question } from '../types';

export interface GradingResult {
  score: number;
  correctCount: number;
  wrongCount: number;
  questionResults: Record<number, boolean>; // questionId -> isCorrect
}

export function gradeExam(questions: Question[], userAnswers: AnswerState): GradingResult {
  let correctCount = 0;
  const questionResults: Record<number, boolean> = {};

  questions.forEach((q) => {
    let isCorrect = false;

    if (q.type === 'PG' || q.type === 'TRUE_FALSE') {
      const userSelected = userAnswers.pgAnswers[q.id];
      if (userSelected && userSelected === q.correctKey) {
        isCorrect = true;
      }
    } else if (q.type === 'MATCHING') {
      const userPairs = userAnswers.matchingAnswers[q.id] || {};
      const totalItems = q.items.length;
      let matchCount = 0;

      q.items.forEach((item) => {
        const correctOpt = q.correctPairs[item.id];
        if (userPairs[item.id] === correctOpt) {
          matchCount++;
        }
      });

      if (matchCount === totalItems && totalItems > 0) {
        isCorrect = true;
      }
    } else if (q.type === 'COMPLEX_PG') {
      const selectedKeys = userAnswers.complexAnswers[q.id] || [];
      const correctSorted = [...q.correctKeys].sort().join(',');
      const selectedSorted = [...selectedKeys].sort().join(',');

      if (selectedSorted === correctSorted && correctSorted.length > 0) {
        isCorrect = true;
      }
    }

    questionResults[q.id] = isCorrect;
    if (isCorrect) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const wrongCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    score,
    correctCount,
    wrongCount,
    questionResults,
  };
}

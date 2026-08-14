import { Question } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function prepareQuestionsForAttempt(questions: Question[], attemptNumber: number): Question[] {
  if (attemptNumber !== 3) {
    return questions;
  }

  // Deep clone and shuffle for attempt 3
  const shuffledQuestions = shuffleArray(questions);

  return shuffledQuestions.map((q) => {
    if (q.type === 'PG' || q.type === 'TRUE_FALSE') {
      return {
        ...q,
        options: shuffleArray(q.options),
      };
    } else if (q.type === 'COMPLEX_PG') {
      return {
        ...q,
        options: shuffleArray(q.options),
      };
    } else if (q.type === 'MATCHING') {
      return {
        ...q,
        items: shuffleArray(q.items),
        options: shuffleArray(q.options),
      };
    }
    return q;
  });
}

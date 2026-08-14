export type QuestionType = 'PG' | 'MATCHING' | 'TRUE_FALSE' | 'COMPLEX_PG';

export interface BaseQuestion {
  id: number;
  bloom: string; // e.g. '[C5 – Pilihan Ganda]'
  type: QuestionType;
  questionText: string;
  pembahasan: string;
}

export interface QuestionPG extends BaseQuestion {
  type: 'PG';
  options: { key: string; text: string }[];
  correctKey: string;
}

export interface MatchingItem {
  id: number;
  text: string;
}

export interface MatchingOption {
  key: string;
  text: string;
}

export interface QuestionMatching extends BaseQuestion {
  type: 'MATCHING';
  items: MatchingItem[];
  options: MatchingOption[];
  correctPairs: Record<number, string>; // item id -> option key
}

export interface StatementItem {
  id: number;
  text: string;
  isTrue: boolean;
}

export interface QuestionTrueFalse extends BaseQuestion {
  type: 'TRUE_FALSE';
  options: { key: string; text: string }[]; // e.g., A, B, C, D, E options
  correctKey: string;
  statements?: StatementItem[];
}

export interface QuestionComplexPG extends BaseQuestion {
  type: 'COMPLEX_PG';
  options: { key: string; text: string }[];
  correctKeys: string[]; // e.g. ['A', 'B', 'D']
}

export type Question = QuestionPG | QuestionMatching | QuestionTrueFalse | QuestionComplexPG;

export interface StudentInfo {
  name: string;
  studentClass: string;
  subject: string;
}

export interface AnswerState {
  pgAnswers: Record<number, string>; // questionId -> selected key
  matchingAnswers: Record<number, Record<number, string>>; // questionId -> { itemId -> selected option key }
  complexAnswers: Record<number, string[]>; // questionId -> array of selected keys
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  subject: string;
  attemptNumber: number; // 1, 2, or 3
  score: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  durationSeconds: number;
  timestamp: string; // ISO string or formatted date
  userAnswers: AnswerState;
  questionOrder: number[]; // array of question IDs in order answered
}

export type ScreenState = 'COVER' | 'EXAM' | 'RESULT' | 'REVIEW' | 'ADMIN_DASHBOARD';

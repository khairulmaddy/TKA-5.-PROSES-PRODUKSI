import { StudentSubmission } from '../types';

const STORAGE_KEY = 'pkk_exam_submissions_v1';

export function getSubmissions(): StudentSubmission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as StudentSubmission[];
  } catch (error) {
    console.error('Failed to load submissions:', error);
    return [];
  }
}

export function saveSubmission(submission: StudentSubmission): void {
  const current = getSubmissions();
  const updated = [submission, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save submission:', error);
  }
}

export function getStudentAttempts(name: string): StudentSubmission[] {
  const all = getSubmissions();
  const normalizedInput = name.trim().toLowerCase();
  return all.filter((s) => s.studentName.trim().toLowerCase() === normalizedInput);
}

export function clearAllSubmissions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

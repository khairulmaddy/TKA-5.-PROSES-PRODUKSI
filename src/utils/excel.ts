import * as XLSX from 'xlsx';
import { StudentSubmission } from '../types';
import { formatSeconds } from './storage';

export function exportSubmissionsToExcel(submissions: StudentSubmission[], fileName = 'Rekap_Nilai_PKK.xlsx'): void {
  const exportData = submissions.map((item, index) => ({
    'No': index + 1,
    'Nama Siswa': item.studentName,
    'Kelas': item.studentClass,
    'Mata Pelajaran': item.subject,
    'Kesempatan Ke': `Ke-${item.attemptNumber}`,
    'Skor (0-100)': item.score,
    'Jawaban Benar': item.correctCount,
    'Jawaban Salah': item.wrongCount,
    'Total Soal': item.totalQuestions,
    'Durasi (Menit:Detik)': formatSeconds(item.durationSeconds),
    'Durasi (Detik)': item.durationSeconds,
    'Tanggal Pencapaian': item.timestamp,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 25 }, // Nama
    { wch: 12 }, // Kelas
    { wch: 35 }, // Mapel
    { wch: 15 }, // Kesempatan
    { wch: 12 }, // Skor
    { wch: 15 }, // Benar
    { wch: 15 }, // Salah
    { wch: 12 }, // Total
    { wch: 20 }, // Durasi (MM:SS)
    { wch: 15 }, // Durasi (Detik)
    { wch: 22 }, // Tanggal
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Nilai');

  XLSX.writeFile(workbook, fileName);
}

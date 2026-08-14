import React, { useState, useEffect } from 'react';
import { StudentSubmission, Question } from '../types';
import { getSubmissions, clearAllSubmissions, formatSeconds } from '../utils/storage';
import { exportSubmissionsToExcel } from '../utils/excel';
import { Download, Search, Trash2, ShieldCheck, Users, Trophy, Percent, Clock, Eye, X, RefreshCw } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

interface AdminDashboardProps {
  questions: Question[];
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ questions, onLogout }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentSubmission | null>(null);

  const loadData = () => {
    const data = getSubmissions();
    setSubmissions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.studentClass === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Extract unique classes for filter dropdown
  const uniqueClasses = Array.from(new Set(submissions.map((s) => s.studentClass)));

  // Calculate stats
  const totalSubmissions = submissions.length;
  const averageScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions)
    : 0;
  const highestScore = totalSubmissions > 0
    ? Math.max(...submissions.map((s) => s.score))
    : 0;
  const passedCount = submissions.filter((s) => s.score >= 75).length;

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SELURUH data rekapitulasi nilai siswa? Action ini tidak dapat dibatalkan.')) {
      clearAllSubmissions();
      loadData();
    }
  };

  const handleExport = () => {
    if (filteredSubmissions.length === 0) {
      alert('Tidak ada data rekapitulasi untuk diunduh.');
      return;
    }
    exportSubmissionsToExcel(filteredSubmissions, `Rekap_Nilai_PKK_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Dashboard Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Web Report Penilaian Admin
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
            Rekapitulasi Hasil Ujian Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Hasil ujian otomatis terekam dari setiap pengerjaan di komputer/browser ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-200 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 border border-rose-200 text-xs font-bold text-rose-700 transition-colors cursor-pointer"
          >
            Logout Admin
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ujian</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-900">{totalSubmissions}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Nilai</span>
            <Percent className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-900">{averageScore}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Nilai Tertinggi</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-900">{highestScore}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Siswa Tuntas (≥75)</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-900">{passedCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="ALL">Semua Kelas</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {submissions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Seluruh Data</span>
          </button>
        )}
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-4">No</th>
                <th className="py-4 px-4">Nama Siswa</th>
                <th className="py-4 px-4">Kelas</th>
                <th className="py-4 px-4 text-center">Kesempatan</th>
                <th className="py-4 px-4 text-center">Skor (0-100)</th>
                <th className="py-4 px-4 text-center">Benar / Salah</th>
                <th className="py-4 px-4 text-center">Durasi</th>
                <th className="py-4 px-4">Tanggal & Waktu</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                    Belum ada data rekapitulasi pengerjaan ujian.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-semibold text-slate-500">{index + 1}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {sub.studentName}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {sub.studentClass}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-800">
                        Ke-{sub.attemptNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-mono font-extrabold text-base ${
                        sub.score >= 75 ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {sub.score}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="text-emerald-600 font-bold">{sub.correctCount}</span> / <span className="text-rose-600 font-bold">{sub.wrongCount}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-slate-600 font-medium">
                      {formatSeconds(sub.durationSeconds)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                      {new Date(sub.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedStudentDetail(sub)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors cursor-pointer border border-indigo-100"
                        title="Lihat Detail Jawaban"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl w-full text-slate-800 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Lembar Jawaban Siswa
              </span>
              <h3 className="text-2xl font-extrabold text-indigo-950">{selectedStudentDetail.studentName}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Kelas: {selectedStudentDetail.studentClass} • Skor: <strong className="text-emerald-600 font-bold">{selectedStudentDetail.score}</strong> • Kesempatan Ke-{selectedStudentDetail.attemptNumber} • Durasi: {formatSeconds(selectedStudentDetail.durationSeconds)}
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  questionNumber={idx + 1}
                  userAnswerPG={selectedStudentDetail.userAnswers.pgAnswers[q.id]}
                  userAnswerMatching={selectedStudentDetail.userAnswers.matchingAnswers[q.id]}
                  userAnswerComplex={selectedStudentDetail.userAnswers.complexAnswers[q.id]}
                  onAnswerPG={() => {}}
                  onAnswerMatching={() => {}}
                  onAnswerComplex={() => {}}
                  reviewMode={true}
                  showPembahasan={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

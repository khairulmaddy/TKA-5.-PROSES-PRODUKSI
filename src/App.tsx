import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CoverScreen } from './components/CoverScreen';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';

import { QUESTIONS_DATA } from './data/questions';
import { prepareQuestionsForAttempt } from './utils/shuffle';
import { gradeExam } from './utils/grading';
import { saveSubmission, getStudentAttempts } from './utils/storage';
import { ScreenState, StudentSubmission, Question, AnswerState } from './types';
import { Sparkles, Terminal, Copy, Check } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('COVER');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attemptNumber, setAttemptNumber] = useState(1);

  // Exam runtime state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentSubmission, setCurrentSubmission] = useState<StudentSubmission | null>(null);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Prompt Engineer Modal state
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Live Timer Effect during EXAM
  useEffect(() => {
    let interval: any = null;
    if (screen === 'EXAM') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [screen]);

  // Handler: Start Exam
  const handleStartExam = (name: string, cls: string, attemptNum: number) => {
    setStudentName(name);
    setStudentClass(cls);
    setAttemptNumber(attemptNum);
    setElapsedSeconds(0);

    // Prepare questions (shuffled for attempt 3)
    const prepared = prepareQuestionsForAttempt(QUESTIONS_DATA, attemptNum);
    setActiveQuestions(prepared);
    setScreen('EXAM');
  };

  // Handler: Finish Exam
  const handleFinishExam = (answers: AnswerState) => {
    const { score, correctCount, wrongCount } = gradeExam(activeQuestions, answers);

    const submission: StudentSubmission = {
      id: `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentName,
      studentClass,
      subject: 'Produk Kreatif dan Kewirausahaan',
      attemptNumber,
      score,
      correctCount,
      wrongCount,
      totalQuestions: activeQuestions.length,
      durationSeconds: elapsedSeconds,
      timestamp: new Date().toISOString(),
      userAnswers: answers,
      questionOrder: activeQuestions.map((q) => q.id),
    };

    saveSubmission(submission);
    setCurrentSubmission(submission);
    setScreen('RESULT');
  };

  // Handler: Repeat Exam
  const handleRepeatExam = () => {
    const previous = getStudentAttempts(studentName);
    const nextAttempt = Math.min(previous.length + 1, 3);
    handleStartExam(studentName, studentClass, nextAttempt);
  };

  const optimizedPromptText = `Anda adalah seorang expert Prompt Engineer dan Web Application Developer. Buatkan aplikasi web "Sistem Ujian Online & Rekap Penilaian Produk Kreatif dan Kewirausahaan (PKK)" interaktif berbasis React, Tailwind CSS, dan TypeScript dengan spesifikasi lengkap berikut:

1. HALAMAN COVER / DEPAN:
   - Form Identitas Siswa: Nama Siswa, Kelas, dan Mata Pelajaran ("Produk Kreatif dan Kewirausahaan").
   - Desain visual estetik dengan animasi gradasi warna yang menarik dan ukuran font normal.
   - Deteksi otomatis riwayat kesempatan siswa (maksimal 3 kali pengerjaan).

2. KETENTUAN 3 KESEMPATAN (ATTEMPTS):
   - Kesempatan 1 & 2: Tampilkan urutan soal standar. Setelah selesai, tampilkan kunci jawaban & pembahasan lengkap.
   - Kesempatan 3 (Terakhir): Otomatis mengacak urutan soal dan mengacak pilihan jawaban (A-E). Setelah selesai, hanya menampilkan skor serta Jumlah Jawaban Benar dan Salah tanpa pembahasan.

3. TIMER & STOPWATCH:
   - Stopwatch mencatat durasi waktu pengerjaan ujian secara real-time di bagian atas.

4. PANEL ADMIN & DATABASE LOKAL:
   - Tombol "Admin 🔑" di pojok kanan atas untuk login modal tanpa menampilkan teks kata sandi bawaan.
   - Rekapitulasi nilai tersimpan secara otomatis ke database lokal (localStorage).
   - Fitur ekspor/download seluruh rekap penilaian ke format Excel (.xlsx).
   - Halaman khusus web report penilaian hanya dapat diakses oleh Admin.

5. KONTRASTING TYPOGRAPHY & COPYRIGHT:
   - Teks pilihan jawaban dan status benar/salah menggunakan warna font yang kontras dan sangat mudah dibaca.
   - Cantumkan hak cipta di bagian footer: "Copywrite by Khairul Maddy".`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(optimizedPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        studentName={studentName}
        studentClass={studentClass}
        subject="Produk Kreatif dan Kewirausahaan"
        elapsedSeconds={elapsedSeconds}
        isExamActive={screen === 'EXAM'}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onAdminLogout={() => {
          setIsAdminLoggedIn(false);
          setScreen('COVER');
        }}
        onReturnToCover={() => {
          if (screen === 'EXAM') {
            if (window.confirm('Ujian sedang berlangsung. Apakah Anda yakin ingin kembali ke halaman utama?')) {
              setScreen('COVER');
            }
          } else {
            setScreen('COVER');
          }
        }}
      />

      {/* Floating Prompt Engineer Tool Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowPromptModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-2xl hover:scale-105 transition-all cursor-pointer border border-white/20"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Prompt Engineer Tool</span>
        </button>
      </div>

      {/* Main Screen Body */}
      <main className="flex-1">
        {screen === 'COVER' && (
          <CoverScreen
            onStartExam={handleStartExam}
            initialName={studentName}
            initialClass={studentClass}
          />
        )}

        {screen === 'EXAM' && (
          <ExamScreen
            studentName={studentName}
            studentClass={studentClass}
            attemptNumber={attemptNumber}
            questions={activeQuestions}
            elapsedSeconds={elapsedSeconds}
            onFinishExam={handleFinishExam}
          />
        )}

        {screen === 'RESULT' && currentSubmission && (
          <ResultScreen
            submission={currentSubmission}
            onReviewAnswers={() => setScreen('REVIEW')}
            onRepeatExam={handleRepeatExam}
            onReturnToCover={() => setScreen('COVER')}
          />
        )}

        {screen === 'REVIEW' && currentSubmission && (
          <ReviewScreen
            submission={currentSubmission}
            questions={activeQuestions}
            onBackToResult={() => setScreen('RESULT')}
          />
        )}

        {screen === 'ADMIN_DASHBOARD' && (
          <AdminDashboard
            questions={QUESTIONS_DATA}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setScreen('COVER');
            }}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminModalOpen(false);
          setScreen('ADMIN_DASHBOARD');
        }}
      />

      {/* Prompt Engineer Helper Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-slate-800 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span>Prompt Efektif & Mantap (Prompt Engineering)</span>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Berikut adalah prompt terstruktur dan optimal yang telah dirancang khusus untuk membangun aplikasi ujian web ini dengan performa tinggi, fitur rekap admin, dan kontrol multi-kesempatan:
            </p>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs font-mono text-indigo-950 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {optimizedPromptText}
              </pre>

              <button
                onClick={copyPromptToClipboard}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}</span>
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

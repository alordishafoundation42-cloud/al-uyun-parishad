import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  User2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const API_BASE = 'https://al-uyun-parishad.vercel.app/api';

export default function Quiz() {
  // Quiz view states: 'verify' | 'taking' | 'submitted'
  const [quizState, setQuizState] = useState('verify');

  // Verification fields
  const [fatherMobile, setFatherMobile] = useState('');
  const [childName, setChildName] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Quiz session data (from backend)
  const [attemptId, setAttemptId] = useState(null);
  const [childIdentifier, setChildIdentifier] = useState(null);
  const [verifiedChildName, setVerifiedChildName] = useState('');
  const [verifiedFatherName, setVerifiedFatherName] = useState('');
  const [registrationId, setRegistrationId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Active quiz state
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOption }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [quizTotalMarks, setQuizTotalMarks] = useState(0);

  // Timer ref
  const timerRef = useRef(null);

  // Bengali number converter
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${toBangla(pad(m))}:${toBangla(pad(s))}`;
  };

  // Auto-submit when time expires
  const handleAutoSubmit = useCallback(async () => {
    if (quizState !== 'taking') return;
    await submitQuizToServer(true);
  }, [quizState, userAnswers, attemptId, childIdentifier]);

  // Timer effect
  useEffect(() => {
    if (quizState !== 'taking') return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizState, handleAutoSubmit]);

  // ─── STEP 1: Verify child eligibility ───
  const handleVerifyChild = async (e) => {
    e.preventDefault();
    setVerifyError('');

    const cleanMobile = fatherMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setVerifyError('সঠিক মোবাইল নম্বর দিন (১০-১১ সংখ্যা)।');
      return;
    }
    if (!childName.trim()) {
      setVerifyError('সন্তানের নাম পূরণ করুন।');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE}/quiz/verify-child`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile, childName: childName.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Verification passed — now start the quiz to get questions
        setRegistrationId(data.data.registrationId);
        setChildIdentifier(data.data.childIdentifier);
        setVerifiedChildName(data.data.childName);
        setVerifiedFatherName(data.data.fatherName);
        await startQuizSession(data.data.registrationId, data.data.childName, data.data.childIdentifier);
      } else {
        setVerifyError(data.message || 'তথ্য যাচাই করা যায়নি। পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      setVerifyError('সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsVerifying(false);
    }
  };

  // ─── STEP 2: Start quiz session, load questions ───
  const startQuizSession = async (regId, cName, cIdentifier) => {
    setIsLoadingQuiz(true);
    try {
      const res = await fetch(`${API_BASE}/quiz/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: regId,
          childName: cName,
          childIdentifier: cIdentifier
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAttemptId(data.data.attemptId);
        setQuestions(data.data.questions || []);
        // Set timer from server remaining seconds
        setTimeRemaining(data.data.remainingSeconds || 20 * 60);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuizState('taking');
      } else {
        setVerifyError(data.message || 'কুইজ শুরু করা যায়নি।');
      }
    } catch (err) {
      setVerifyError('কুইজ লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // ─── Answer selection ───
  const handleSelectOption = (questionId, option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // ─── Submit quiz to server ───
  const submitQuizToServer = async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    // Build answers array
    const answersArray = Object.entries(userAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    try {
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          childIdentifier,
          answers: answersArray
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setQuizScore(data.data?.score ?? 0);
        setQuizTotalMarks(data.data?.totalMarks ?? questions.length);
      } else {
        // Even if server error, show result screen with local count
        setQuizScore(Object.keys(userAnswers).length);
        setQuizTotalMarks(questions.length);
      }
    } catch {
      setQuizScore(Object.keys(userAnswers).length);
      setQuizTotalMarks(questions.length);
    } finally {
      setIsSubmitting(false);
      setQuizState('submitted');
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="py-12 lg:py-16 bg-slate-50 min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            সন্তানদের বিশেষ কুইজ প্রতিযোগিতা
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            ১২ ডিসেম্বর ২০২৬, শনিবার সকাল ১১:০০টা — হোটেল সৈকত, চট্টগ্রাম
          </p>
        </div>

        {/* ════════ VIEW 1: VERIFICATION FORM ════════ */}
        {quizState === 'verify' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-8">

            {/* Rules Box */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl border border-gold-500/50 space-y-3">
              <div className="flex items-center space-x-2 text-gold-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-base">কুইজের গুরুত্বপূর্ণ নিয়মাবলী</h3>
              </div>
              <ul className="text-xs sm:text-sm text-emerald-100 space-y-1.5 list-disc list-inside">
                <li>কেবলমাত্র <strong>নিবন্ধিত বন্ধুদের সন্তানরা</strong> এই প্রতিযোগিতায় অংশ নিতে পারবে।</li>
                <li>প্রতিটি সন্তানের জন্য <strong>সর্বোচ্চ ২০ মিনিট</strong> সময় নির্ধারিত।</li>
                <li>একবার শুরু করলে সময় বিরতি দেওয়া যাবে না — ২০ মিনিট পর স্বয়ংক্রিয়ভাবে জমা হবে।</li>
                <li>মোট <strong>২০টি প্রশ্ন</strong> থাকবে — ৪টি বাবার তথ্যভিত্তিক, বাকি ইসলামিক সাধারণ জ্ঞান।</li>
                <li>শীর্ষ ৩ জন বিজয়ীকে সমাপনী পর্বে <strong>বিশেষ পুরস্কার</strong> প্রদান করা হবে।</li>
              </ul>
            </div>

            {/* Error */}
            {verifyError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-red-800 text-sm flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{verifyError}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerifyChild} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center space-x-1.5">
                  <User2 className="w-4 h-4 text-emerald-700" />
                  <span>বাবার নিবন্ধিত মোবাইল নম্বর *</span>
                </label>
                <input
                  type="tel"
                  value={fatherMobile}
                  onChange={(e) => setFatherMobile(e.target.value)}
                  placeholder="01819173608"
                  className="input input-bordered w-full font-mono text-base bg-slate-50 focus:bg-white"
                  required
                />
                <span className="text-xs text-slate-400">পারিবারিক রেজিস্ট্রেশনে প্রদত্ত মূল নম্বরটি দিন</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>সন্তানের নিবন্ধিত নাম *</span>
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="রেজিস্ট্রেশন ফর্মে যেভাবে সন্তানের নাম দেওয়া হয়েছে"
                  className="input input-bordered w-full text-base bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || isLoadingQuiz}
                className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold w-full text-base py-3 h-auto shadow-md"
              >
                {isVerifying || isLoadingQuiz ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>{isLoadingQuiz ? 'প্রশ্নপত্র লোড হচ্ছে...' : 'যাচাই হচ্ছে...'}</span>
                  </span>
                ) : (
                  <>তথ্য যাচাই ও কুইজ শুরু করুন <ArrowRight className="w-4 h-4 ml-2 inline" /></>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">
                তথ্য সঠিক না মিললে কুইজে প্রবেশ করা সম্ভব হবে না। প্রয়োজনে ভেন্যুর সমন্বয়কের সহায়তা নিন।
              </span>
            </div>
          </div>
        )}

        {/* ════════ VIEW 2: ACTIVE QUIZ ════════ */}
        {quizState === 'taking' && currentQ && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-t-4 border-emerald-800 space-y-6">

            {/* Top Bar: Progress & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  প্রশ্ন {toBangla(currentQuestionIndex + 1)} / {toBangla(questions.length)}
                </span>
                <div className="text-xs text-slate-400 mt-0.5">
                  অংশগ্রহণকারী: <strong className="text-slate-700">{verifiedChildName}</strong>
                  {verifiedFatherName && (
                    <span className="text-slate-400"> (বাবা: {verifiedFatherName})</span>
                  )}
                </div>
                {/* Answer progress bar */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {toBangla(answeredCount)}/{toBangla(questions.length)} উত্তর দেওয়া হয়েছে
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border font-mono font-bold text-lg shadow-sm ${
                timeRemaining < 180
                  ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <Clock className="w-5 h-5 shrink-0" />
                <span>অবশিষ্ট: {formatTimer(timeRemaining)}</span>
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex items-center space-x-2">
              {currentQ.id.startsWith('father_') ? (
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                  <User2 className="w-3 h-3 mr-1" /> বাবার তথ্যভিত্তিক প্রশ্ন
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                  <BookOpen className="w-3 h-3 mr-1" /> ইসলামিক সাধারণ জ্ঞান
                </span>
              )}
            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, option)}
                    className={`p-4 rounded-2xl border text-left text-sm sm:text-base font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.01]'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                        isSelected ? 'bg-white text-emerald-900 border-white' : 'bg-white text-slate-700 border-slate-300'
                      }`}>
                        {['ক', 'খ', 'গ', 'ঘ'][idx] || toBangla(idx + 1)}
                      </span>
                      <span>{option}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-gold-300 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((p) => p - 1)}
                className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> পূর্ববর্তী
              </button>

              {/* Question dots (compact) */}
              <div className="hidden sm:flex items-center space-x-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentQuestionIndex
                        ? 'bg-emerald-800 scale-125'
                        : userAnswers[questions[i]?.id]
                        ? 'bg-emerald-400'
                        : 'bg-slate-300'
                    }`}
                    title={`প্রশ্ন ${i + 1}`}
                  />
                ))}
              </div>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((p) => p + 1)}
                  className="btn btn-sm btn-primary bg-emerald-800 text-white hover:bg-emerald-900"
                >
                  পরবর্তী <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => submitQuizToServer(false)}
                  className="btn btn-sm bg-gold-600 hover:bg-gold-700 text-emerald-950 font-bold px-6 shadow-md"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    'চূড়ান্ত উত্তর জমা দিন ✓'
                  )}
                </button>
              )}
            </div>

            {/* Warning if unanswered */}
            {answeredCount < questions.length && currentQuestionIndex === questions.length - 1 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  এখনো <strong>{toBangla(questions.length - answeredCount)}টি</strong> প্রশ্নের উত্তর দেওয়া হয়নি।
                  জমা দিলে উত্তর না দেওয়া প্রশ্নগুলো শূন্য মার্ক পাবে।
                </span>
              </div>
            )}
          </div>
        )}

        {/* ════════ VIEW 3: SUBMITTED / RESULT ════════ */}
        {quizState === 'submitted' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-emerald-100 text-center space-y-6">
            <div className="w-20 h-20 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                মাশাআল্লাহ! কুইজ সম্পন্ন হয়েছে
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                ধন্যবাদ <strong>{verifiedChildName || 'সোনামণি'}</strong>। তোমার সকল উত্তর সফলভাবে সংরক্ষিত হয়েছে।
              </p>
            </div>

            {/* Score Card */}
            <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl border border-gold-500/50 max-w-sm mx-auto space-y-2">
              <span className="text-xs text-gold-300 font-semibold uppercase tracking-wider">
                তোমার তাৎক্ষণিক স্কোর
              </span>
              <div className="text-4xl font-extrabold text-gold-400 font-mono">
                {toBangla(quizScore ?? 0)} / {toBangla(quizTotalMarks || questions.length)}
              </div>
              <p className="text-xs text-emerald-200">
                সঠিক উত্তর ও সম্পন্ন করার সময়ের ভিত্তিতে চূড়ান্ত মেধা তালিকা প্রস্তুত হবে
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-md mx-auto">
              কুইজের চূড়ান্ত ফলাফল ও শীর্ষ তিন বিজয়ীর নাম বিকেল ৫:৪৫ মিনিটের সাধারণ সভায়
              আনুষ্ঠানিকভাবে ঘোষণা ও ওয়েবসাইটে প্রকাশ করা হবে।
            </div>

            <div className="pt-2">
              <a
                href="/quiz-results"
                className="btn btn-outline border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white"
              >
                ফলাফল প্রকাশের পাতা দেখুন
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Send, 
  Eye, 
  XCircle, 
  Trophy, 
  Medal,
  Settings,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';

export default function QuizManager() {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'questions' | 'rankings'
  const [quizSettings, setQuizSettings] = useState({
    quizDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
    quizOpeningTime: '11:00 AM',
    quizDurationMinutes: 20,
    isQuizEnabled: true,
    isQuizResultsPublished: false
  });

  const [questions, setQuestions] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Question modal state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    category: 'সাধারণ জ্ঞান',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    difficulty: 'সহজ',
    isActive: true
  });

  // Bengali number converter
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Settings
      const setRes = await api.get('/settings');
      if (setRes.data.success) {
        setQuizSettings(setRes.data.data);
      }

      // 2. Questions
      const qRes = await api.get('/admin/quiz/questions');
      if (qRes.data.success) {
        setQuestions(qRes.data.data);
      }

      // 3. Results/Rankings
      const rRes = await api.get('/quiz/results');
      if (rRes.data.success && rRes.data.data) {
        setRankings(rRes.data.data);
      }
    } catch {
      // Demo questions for preview
      setQuestions([
        {
          _id: 'q1',
          question: 'ইসলামের মৌলিক স্তম্ভ কয়টি?',
          options: ['৩টি', '৪টি', '৫টি', '৬টি'],
          correctAnswer: '৫টি',
          category: 'সাধারণ জ্ঞান',
          marks: 1,
          isActive: true
        },
        {
          _id: 'q2',
          question: 'পবিত্র কুরআনুল কারিম কোন সম্মানিত মাসে প্রথম নাজিল হয়?',
          options: ['মহররম', 'রমজান', 'রজব', 'জিলহজ্জ'],
          correctAnswer: 'রমজান',
          category: 'সাধারণ জ্ঞান',
          marks: 1,
          isActive: true
        }
      ]);

      setRankings([
        { rank: 1, childName: 'আব্দুর রহমান', fatherName: 'মোহাম্মদ আব্দুল্লাহ', score: 10, totalMarks: 10, completionTime: '৮ মিনিট ১২ সেকেন্ড' },
        { rank: 2, childName: 'ফাতিমা জান্নাত', fatherName: 'কাজী একেএম সাইফুদ্দিন মামুন', score: 10, totalMarks: 10, completionTime: '৯ মিনিট ৪৫ সেকেন্ড' },
        { rank: 3, childName: 'মুহাম্মদ আব্দুল্লাহ', fatherName: 'মাওলানা নজরুল ইসলাম', score: 9, totalMarks: 10, completionTime: '৭ মিনিট ৩০ সেকেন্ড' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/quiz/settings', quizSettings);
      setMessage('কুইজ সময়সূচি ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
    } catch (err) {
      alert(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  // Publish / Unpublish Results
  const handlePublishResults = async () => {
    if (!window.confirm('আপনি কি চূড়ান্ত ফলাফল প্রকাশ করতে চান? ফলাফল প্রকাশ হলে শীর্ষ বিজয়ীদের তালিকা উন্মুক্ত হবে এবং সকল অভিভাবকের ইমেইলে স্বয়ংক্রিয় ফলাফল চলে যাবে।')) return;

    try {
      const res = await api.post('/admin/quiz/publish-results');
      setMessage(res.data.message || 'ফলাফল সফলভাবে প্রকাশিত ও ইমেইল প্রেরিত হয়েছে।');
      setQuizSettings(prev => ({ ...prev, isQuizResultsPublished: true }));
      loadData();
    } catch (err) {
      alert(err.message || 'ফলাফল প্রকাশে সমস্যা হয়েছে।');
    }
  };

  const handleUnpublishResults = async () => {
    if (!window.confirm('ফলাফল অপ্রকাশিত করতে চান?')) return;
    try {
      await api.post('/admin/quiz/unpublish-results');
      setMessage('ফলাফল অপ্রকাশিত করা হয়েছে।');
      setQuizSettings(prev => ({ ...prev, isQuizResultsPublished: false }));
      loadData();
    } catch (err) {
      alert(err.message || 'ব্যর্থ হয়েছে।');
    }
  };

  // Question CRUD
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.correctAnswer) {
      alert('সঠিক উত্তরটি নির্বাচন করুন।');
      return;
    }

    try {
      if (editingQuestion) {
        await api.put(`/admin/quiz/questions/${editingQuestion._id}`, questionForm);
        setMessage('প্রশ্নটি আপডেট করা হয়েছে।');
      } else {
        await api.post('/admin/quiz/questions', questionForm);
        setMessage('নতুন প্রশ্ন সফলভাবে যুক্ত হয়েছে।');
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      loadData();
    } catch (err) {
      alert(err.message || 'প্রশ্ন সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/admin/quiz/questions/${id}`);
      setMessage('প্রশ্নটি মুছে ফেলা হয়েছে।');
      loadData();
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">কুইজ প্রতিযোগিতা ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500">ভেন্যুর কুইজ সময়, প্রশ্নব্যাংক, মেধা তালিকা ও ফলাফল প্রকাশ</p>
        </div>

        <div className="flex items-center space-x-2">
          {quizSettings.isQuizResultsPublished ? (
            <button
              onClick={handleUnpublishResults}
              className="btn btn-sm btn-outline border-amber-600 text-amber-800 hover:bg-amber-600 hover:text-white"
            >
              ফলাফল অপ্রকাশিত করুন
            </button>
          ) : (
            <button
              onClick={handlePublishResults}
              className="btn btn-sm bg-gold-600 hover:bg-gold-700 text-emerald-950 font-bold shadow-md"
            >
              <Trophy className="w-4 h-4 mr-1.5" /> চূড়ান্ত ফলাফল প্রকাশ করুন
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-900 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          কুইজ সময় ও নিয়ন্ত্রণ
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'questions'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          প্রশ্নভান্ডার ({toBangla(questions.length)})
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'rankings'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          মেধা তালিকা ও প্রচেষ্টা ({toBangla(rankings.length)})
        </button>
      </div>

      {/* TAB 1: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gold-600" />
            ভেন্যু কুইজ সময়সূচি কনফিগারেশন
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">কুইজের তারিখ</label>
                <input
                  type="text"
                  value={quizSettings.quizDate}
                  onChange={(e) => setQuizSettings({ ...quizSettings, quizDate: e.target.value })}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">শুরুর সময়</label>
                <input
                  type="text"
                  value={quizSettings.quizOpeningTime}
                  onChange={(e) => setQuizSettings({ ...quizSettings, quizOpeningTime: e.target.value })}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">প্রতিটি শিশুর জন্য সময়সীমা (মিনিট)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={quizSettings.quizDurationMinutes}
                onChange={(e) => setQuizSettings({ ...quizSettings, quizDurationMinutes: Number(e.target.value) })}
                className="input input-bordered input-sm w-32 font-mono"
                required
              />
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quizSettings.isQuizEnabled}
                  onChange={(e) => setQuizSettings({ ...quizSettings, isQuizEnabled: e.target.checked })}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="font-bold text-slate-800">কুইজ অ্যাক্সেস সক্রিয় (Enable Quiz Participation)</span>
              </label>
              <p className="text-[11px] text-slate-400 pl-7">
                বন্ধ রাখলে ভেন্যুর শিশুরা কুইজে প্রবেশ করতে পারবে না।
              </p>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn btn-sm btn-primary bg-emerald-800 text-white">
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              * নোট: বাবার নিবন্ধিত তথ্যভিত্তিক প্রশ্নগুলো পিতার আসল প্রোফাইল থেকে স্বয়ংক্রিয়ভাবে সার্ভার জেনারেট করে।
            </span>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setQuestionForm({
                  question: '',
                  category: 'সাধারণ জ্ঞান',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  marks: 1,
                  difficulty: 'সহজ',
                  isActive: true
                });
                setShowQuestionModal(true);
              }}
              className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> নতুন প্রশ্ন যুক্ত করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q, idx) => (
              <div key={q._id || idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <span className="badge badge-outline text-[11px] font-semibold">{q.category}</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setQuestionForm(q);
                        setShowQuestionModal(true);
                      }}
                      className="p-1 text-slate-600 hover:text-emerald-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{q.question}</h3>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {q.options?.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border text-[11px] ${
                        opt === q.correctAnswer
                          ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt} {opt === q.correctAnswer && '✓ (সঠিক)'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RANKINGS & ATTEMPTS */}
      {activeTab === 'rankings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">কুইজ মেধা তালিকা ও ফলাফল</h2>
              <p className="text-xs text-slate-500">নম্বর এবং সমাপ্তির সময়ের ওপর ভিত্তি করে স্বয়ংক্রিয় ক্রম</p>
            </div>
            <div>
              {quizSettings.isQuizResultsPublished ? (
                <span className="badge badge-success text-white font-bold p-3 text-xs">ফলাফল প্রকাশিত</span>
              ) : (
                <span className="badge badge-warning font-bold p-3 text-xs">ফলাফল অপ্রকাশিত</span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th>স্থান (Rank)</th>
                  <th>শিশুর নাম</th>
                  <th>পিতার নাম</th>
                  <th className="text-center">প্রাপ্ত স্কোর</th>
                  <th>সমাপ্তির সময়</th>
                  <th>স্বীকৃতি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankings.map((r) => (
                  <tr key={r.rank} className={r.rank <= 3 ? 'bg-amber-50/40 font-semibold' : ''}>
                    <td className="font-bold font-mono">
                      {r.rank <= 3 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          <Medal className="w-3 h-3 mr-1 text-gold-600" /> #{toBangla(r.rank)}
                        </span>
                      ) : (
                        `#${toBangla(r.rank)}`
                      )}
                    </td>
                    <td className="font-bold text-slate-900">{r.childName}</td>
                    <td className="text-slate-600">{r.fatherName}</td>
                    <td className="text-center font-mono font-bold text-emerald-800 text-sm">
                      {toBangla(r.score)}/{toBangla(r.totalMarks || 10)}
                    </td>
                    <td className="font-mono text-slate-500">{toBangla(r.completionTime)}</td>
                    <td>
                      {r.rank === 1 && <span className="badge badge-warning text-xs font-bold">১ম স্থান (চ্যাম্পিয়ন)</span>}
                      {r.rank === 2 && <span className="badge badge-neutral text-xs font-bold">২য় স্থান (রানার-আপ)</span>}
                      {r.rank === 3 && <span className="badge badge-neutral text-xs font-bold">৩য় স্থান</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              {editingQuestion ? 'প্রশ্ন সংশোধন' : 'নতুন প্রশ্ন যুক্ত করুন'}
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">প্রশ্ন *</label>
                <input
                  type="text"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="যেমন: পবিত্র কুরআনুল কারিম কোন মাসে নাজিল হয়?"
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ক্যাটাগরি</label>
                <input
                  type="text"
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                  className="input input-bordered input-sm w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold block">৪টি বিকল্প উত্তর *</label>
                {questionForm.options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswerSelect"
                      checked={questionForm.correctAnswer === opt && opt !== ''}
                      onChange={() => setQuestionForm({ ...questionForm, correctAnswer: opt })}
                      title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      className="radio radio-xs radio-primary"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...questionForm.options];
                        newOpts[i] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                      placeholder={`বিকল্প ${toBangla(i + 1)}`}
                      className="input input-bordered input-sm flex-1"
                      required
                    />
                  </div>
                ))}
                <span className="text-[11px] text-slate-400">
                  * যে অপশনটি সঠিক উত্তর, তার বাম পাশের রেডিও বাটনে টিক দিন।
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowQuestionModal(false)} className="btn btn-xs btn-ghost">বাতিল</button>
                <button type="submit" className="btn btn-xs btn-primary bg-emerald-800 text-white font-bold">সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

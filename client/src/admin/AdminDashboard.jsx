import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import api from '../services/api';
import { downloadRegistrationsCSV } from '../utils/exportCsv';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalParticipants: 0,
    totalExpectedFee: 0,
    totalVerifiedPayments: 0,
    pendingPaymentsCount: 0,
    totalQuizParticipants: 0,
    completedQuizCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Bengali number converter
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        setStats({
          totalRegistrations: 0,
          totalParticipants: 0,
          totalExpectedFee: 0,
          totalVerifiedPayments: 0,
          pendingPaymentsCount: 0,
          totalQuizParticipants: 0,
          completedQuizCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadRegistrationsCSV();
    } catch (err) {
      alert(err.message || 'CSV ফাইল ডাউনলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            অ্যাডমিন ড্যাশবোর্ড সারসংক্ষেপ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার) সামগ্রিক অগ্রগতি
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/registrations"
            className="btn btn-sm btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-medium"
          >
            <Users className="w-4 h-4 mr-1.5" /> সকল রেজিস্ট্রেশন
          </Link>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
          >
            {exporting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                ডাউনলোড হচ্ছে...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> CSV ডাউনলোড
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Key Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Total Registrations */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>মোট নিবন্ধিত বন্ধু</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {toBangla(stats.totalRegistrations)} জন
          </div>
          <p className="text-xs text-slate-400">অনলাইনে জমাকৃত মূল পরিবারের সংখ্যা</p>
        </div>

        {/* Card 2: Total Participants */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>মোট অংশগ্রহণকারী মানুষ</span>
            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-900 font-mono">
            {toBangla(stats.totalParticipants)} জন
          </div>
          <p className="text-xs text-slate-400">বন্ধু + স্ত্রী + সন্তান ও আত্মীয়বর্গ</p>
        </div>

        {/* Card 3: Total Expected Fees */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>প্রত্যাশিত মোট ফি</span>
            <div className="p-2.5 bg-purple-50 text-purple-800 rounded-2xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-900 font-mono">
            {toBangla(stats.totalExpectedFee)} ৳
          </div>
          <p className="text-xs text-slate-400">প্রতি অংশগ্রহণকারী ১,০০০ টাকা হারে</p>
        </div>

        {/* Card 4: Verified Payments */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>যাচাইকৃত প্রাপ্ত ফি</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-800 font-mono">
            {toBangla(stats.totalVerifiedPayments)} ৳
          </div>
          <p className="text-xs text-slate-400">অ্যাডমিন কর্তৃক নিশ্চিতকৃত পেমেন্ট</p>
        </div>

        {/* Card 5: Pending Payments */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>অপেক্ষমাণ পেমেন্ট</span>
            <div className="p-2.5 bg-amber-50 text-amber-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-700 font-mono">
            {toBangla(stats.pendingPaymentsCount)} টি
          </div>
          <p className="text-xs text-slate-400">যাচাই ও অনুমোদনের অপেক্ষায় রয়েছে</p>
        </div>

        {/* Card 6: Quiz Participants */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>কুইজে অংশগ্রহণকারী শিশু</span>
            <div className="p-2.5 bg-gold-50 text-gold-700 rounded-2xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gold-700 font-mono">
            {toBangla(stats.totalQuizParticipants)} জন
          </div>
          <p className="text-xs text-slate-400">ডিজিটাল কুইজ সম্পন্ন করেছে</p>
        </div>

      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-emerald-800" />
            পেমেন্ট ও নিবন্ধন ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            বন্ধুদের জমাকৃত বিকাশ ট্রানজ্যাকশন আইডি ও ব্যাংক রসিদ যাচাই করে রেজিস্ট্রেশন নিশ্চিত করুন এবং স্বয়ংক্রিয় ইমেইল নোটিফিকেশন পাঠান।
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/admin/payments" className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white">
              পেমেন্ট যাচাই করুন →
            </Link>
            <Link to="/admin/registrations" className="btn btn-sm btn-outline border-slate-300 text-slate-700">
              রেজিস্ট্রেশন তালিকা দেখুন
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center">
            <Award className="w-5 h-5 mr-2 text-gold-600" />
            কুইজ নিয়ন্ত্রণ ও ফলাফল প্রকাশ
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            ভেন্যুর কুইজ প্রশ্ন প্রস্তুত করুন, সময়সীমা নিয়ন্ত্রণ করুন এবং সমাপ্তির পর ফলাফল আনুষ্ঠানিকভাবে প্রকাশ ও অভিভাবকদের ইমেইল প্রেরণ করুন।
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/admin/quiz" className="btn btn-sm bg-gold-600 hover:bg-gold-700 text-emerald-950 font-bold">
              কুইজ ম্যানেজমেন্টে যান →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Users, 
  Banknote, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  Printer, 
  FileText,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

export default function RegistrationStatus() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Bengali number conversion
  const toBangla = (num) => {
    if (num === null || num === undefined) return '';
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  // Convert Bengali numerals in input to English digits
  const toEnglishDigits = (str) => {
    if (!str) return '';
    const bengaliMap = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    return str.replace(/[০-৯]/g, d => bengaliMap[d]);
  };

  const executeSearch = async (queryToSearch) => {
    const raw = (queryToSearch || '').trim();
    if (!raw) return;

    setLoading(true);
    setNotFound(false);
    setError('');
    setResult(null);

    const converted = toEnglishDigits(raw).trim();

    try {
      // Use configured api service which targets https://al-uyun-parishad.vercel.app/api
      const response = await api.get(`/registrations/status/${encodeURIComponent(converted)}`);
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      if (err.response?.status === 404 || err.message?.includes('404') || err.message?.includes('পাওয়া যায়নি')) {
        setNotFound(true);
      } else {
        setError(err.response?.data?.message || err.message || 'সার্ভারে সংযোগে সমস্যা দেখা দিয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if parameter provided in URL e.g. /registration-status?reg=AUP-2026-1001
  useEffect(() => {
    const urlQuery = searchParams.get('reg') || searchParams.get('mobile') || searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      executeSearch(urlQuery);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 lg:py-16 bg-slate-50 min-h-[75vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            রেজিস্ট্রেশন ও পেমেন্ট স্ট্যাটাস
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            আপনার রেজিস্ট্রেশন নম্বর (যেমন: <span className="font-mono font-bold text-emerald-800">AUP-2026-1001</span>) অথবা নিবন্ধিত মোবাইল নম্বর দিয়ে বর্তমান স্ট্যাটাস যাচাই করুন।
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span>রেজিস্ট্রেশন নম্বর অথবা মোবাইল নম্বর</span>
              <span className="text-xs text-slate-400 font-normal">বাংলা বা ইংরেজি উভয় নম্বরে সার্চ করা যাবে</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যেমন: AUP-2026-1001 অথবা 01819173608"
                  className="input input-bordered w-full font-mono text-base bg-slate-50 focus:bg-white pl-4 pr-10"
                  required
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setResult(null); setNotFound(false); setError(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
                    title="মুছে ফেলুন"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 shrink-0 h-auto py-3"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>অনুসন্ধান হচ্ছে...</span>
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-1.5" /> স্ট্যাটাস দেখুন
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
              <span>💡 টিপস: আপনি শুধু ক্রমিক নম্বর যেমন <strong>1001</strong> লিখেও অনুসন্ধান করতে পারেন।</span>
              <Link to="/registration" className="text-emerald-700 hover:underline font-medium">
                নতুন রেজিস্ট্রেশন করতে চান? এখানে ক্লিক করুন →
              </Link>
            </div>
          </form>
        </div>

        {/* Not Found Alert */}
        {notFound && (
          <div className="p-8 bg-white rounded-3xl border border-red-200 shadow-sm text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">রেজিস্ট্রেশন তথ্য পাওয়া যায়নি</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                <span className="font-mono font-semibold text-red-600">"{searchQuery}"</span> অনুযায়ী কোনো তথ্য খুঁজে পাওয়া যায়নি।
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-lg mx-auto text-left space-y-1.5">
              <p className="font-semibold text-slate-800">অনুগ্রহ করে নিচের বিষয়গুলো যাচাই করুন:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>রেজিস্ট্রেশন ফর্মে প্রদত্ত সঠিক মোবাইল নম্বরটি লিখেছেন কিনা</li>
                <li>রেজিস্ট্রেশন নম্বরে কোনো বানান বা সংখ্যা ভুল হয়েছে কিনা (যেমন: <span className="font-mono">AUP-2026-1001</span>)</li>
                <li>রেজিস্ট্রেশন সম্পন্ন করা না থাকলে অনুগ্রহ করে নতুনভাবে নিবন্ধন সম্পন্ন করুন</li>
              </ul>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link to="/registration" className="btn btn-sm btn-primary bg-emerald-800 text-white">
                এখনই রেজিস্ট্রেশন করুন
              </Link>
              <a href="tel:+8801819173608" className="btn btn-sm btn-outline border-slate-300 text-slate-700">
                <PhoneCall className="w-3.5 h-3.5 mr-1" /> সহায়তার জন্য কল করুন
              </a>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-5 bg-amber-50 border-l-4 border-amber-500 rounded-2xl text-amber-900 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">ত্রুটি ঘটেছে</p>
              <p className="text-xs text-amber-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Result Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-lg border-t-4 border-emerald-800 overflow-hidden animate-fadeIn">
            
            {/* Top Bar with Registration Number & Status */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gold-300 font-semibold tracking-wider uppercase">
                  রেজিস্ট্রেশন নম্বর
                </span>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-gold-400 tracking-wider">
                    {result.registrationNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(result.registrationNumber)}
                    className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-gold-300 transition-colors"
                    title="নম্বরটি কপি করুন"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {result.createdAt && (
                  <span className="text-[11px] text-emerald-200 block mt-1">
                    আবেদনের তারিখ: {new Date(result.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="text-left sm:text-right">
                <span className="text-xs text-emerald-200 block mb-1">পেমেন্ট ও নিবন্ধন অবস্থা</span>
                {result.paymentStatus === 'Verified' ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> যাচাইকৃত ও নিশ্চিত (Verified)
                  </span>
                ) : result.paymentStatus === 'Rejected' ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md">
                    <XCircle className="w-4 h-4 mr-1.5" /> বাতিলকৃত (Rejected)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-sm shadow-md">
                    <Clock className="w-4 h-4 mr-1.5" /> অপেক্ষমাণ / যাচাইাধীন (Pending)
                  </span>
                )}
              </div>
            </div>

            {/* Status Summary Banner */}
            <div className={`p-4 border-b text-xs sm:text-sm flex items-center space-x-2 ${
              result.paymentStatus === 'Verified'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                : result.paymentStatus === 'Rejected'
                ? 'bg-red-50 text-red-900 border-red-100'
                : 'bg-amber-50 text-amber-900 border-amber-100'
            }`}>
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>
                {result.paymentStatus === 'Verified'
                  ? 'আপনার শুভেচ্ছা ফি সফলভাবে গৃহীত ও যাচাই সম্পন্ন হয়েছে। মিলনমেলায় সপরিবারে আপনার অংশগ্রহণ নিশ্চিত।'
                  : result.paymentStatus === 'Rejected'
                  ? 'পেমেন্ট যাচাইয়ে অসংগতি দেখা যাওয়ায় আবেদনটি সাময়িক স্থগিত আছে। অনুগ্রহ করে সমন্বয়কের সাথে যোগাযোগ করুন।'
                  : 'আপনার জমাকৃত পেমেন্ট তথ্য সমন্বয়ক কমিটির যাচাইয়ের প্রক্রিয়ায় রয়েছে। খুব শীঘ্রই স্ট্যাটাস নিশ্চিত করা হবে।'}
              </span>
            </div>

            {/* Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Friend Name */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">নিবন্ধিত বন্ধুর নাম</span>
                  <div className="text-base font-bold text-slate-900">
                    {result.friendName}
                  </div>
                </div>

                {/* Masked Mobile */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">নিবন্ধিত মোবাইল নম্বর</span>
                  <div className="text-base font-mono font-bold text-slate-800">
                    {result.maskedMobile || '***'}
                  </div>
                </div>

                {/* Total Participants */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">মোট অংশগ্রহণকারী</span>
                  <div className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{toBangla(result.participantCount)} জন (বন্ধু + পরিবার)</span>
                  </div>
                </div>

                {/* Total Fee */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">নির্ধারিত শুভেচ্ছা ফি</span>
                  <div className="text-base font-bold text-emerald-800 flex items-center space-x-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>{toBangla(result.totalFee)} টাকা</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">পেমেন্টের মাধ্যম</span>
                  <div className="text-sm font-semibold text-slate-800">
                    {result.paymentMethod || 'ক্যাশ / ব্যাংক / বিকাশ'}
                  </div>
                </div>

                {/* Payment Details (Cash Receiver / TrxID / Slip) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-xs text-slate-500 font-medium">পেমেন্টের বিবরণ / তথ্য</span>
                  <div className="text-sm font-semibold text-slate-800">
                    {result.cashReceiver ? (
                      <span className="text-emerald-800 font-medium">
                        ক্যাশ জমাদান: <strong>{result.cashReceiver}</strong>-এর নিকট
                      </span>
                    ) : result.maskedTransactionId ? (
                      <span className="font-mono text-slate-700">
                        TrxID: {result.maskedTransactionId}
                      </span>
                    ) : result.hasReceipt ? (
                      <span className="text-emerald-700 font-medium">
                        রসিদ স্লিপ আপলোড করা হয়েছে ✓
                      </span>
                    ) : (
                      <span className="text-slate-500">অনলাইন পেমেন্ট</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Family Members Section if available */}
              {Array.isArray(result.familyMembersList) && result.familyMembersList.length > 0 && (
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase">
                    <span>পরিবারের নিবন্ধিত সদস্যবৃন্দ ({toBangla(result.familyMembersList.length)} জন)</span>
                    <span className="text-[11px] font-normal text-emerald-700">গোপনীয়তা রক্ষিত</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.familyMembersList.map((m, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-white border border-emerald-200 rounded-full text-xs font-medium text-slate-800 shadow-2xs"
                      >
                        <UserCheck className="w-3 h-3 mr-1 text-emerald-700" />
                        {m.name} <span className="text-slate-400 ml-1">({m.relationship})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Details Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <span>মিলনমেলা অনুষ্ঠানের সময়সূচি ও ভেন্যু</span>
                </div>
                <p>
                  <strong>তারিখ:</strong> ১২ ডিসেম্বর ২০২৬, শনিবার (সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত)<br />
                  <strong>ভেন্যু:</strong> হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 sm:flex-none"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" /> স্লিপ প্রিন্ট করুন
                  </button>
                  <button
                    onClick={() => handleCopy(result.registrationNumber)}
                    className="btn btn-sm btn-outline border-emerald-700 text-emerald-800 hover:bg-emerald-50 flex-1 sm:flex-none"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" /> {copied ? 'কপি হয়েছে!' : 'নম্বর কপি'}
                  </button>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Link
                    to="/quiz"
                    className="btn btn-sm bg-gold-600 hover:bg-gold-700 text-emerald-950 font-bold w-full sm:w-auto shadow-sm"
                  >
                    সন্তানদের কুইজ প্রতিযোগিতা <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </Link>
                </div>
              </div>

              {/* Contact Assistance */}
              <div className="text-center pt-2 text-xs text-slate-500">
                যেকোনো জিজ্ঞাসা বা সংশোধনের জন্য যোগাযোগ করুন: <strong>কাজী একেএম সাইফুদ্দিন মামুন</strong> (
                <a href="tel:+8801819173608" className="text-emerald-700 font-mono underline">+880 1819-173608</a>)
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

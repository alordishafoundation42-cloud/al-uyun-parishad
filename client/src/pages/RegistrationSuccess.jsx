import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Copy, Calendar, MapPin, Search, ArrowRight, Printer } from 'lucide-react';

export default function RegistrationSuccess() {
  const location = useLocation();
  const state = location.state;

  // Bengali number conversion
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  // If accessed directly without state, fallback to a friendly default or redirect
  const registrationNumber = state?.registrationNumber || 'AUP-2026-XXXX';
  const friendName = state?.friendName || 'সম্মানিত বন্ধু';
  const participantCount = state?.participantCount || 1;
  const totalFee = state?.totalFee || 1000;

  const [copied, setCopied] = React.useState(false);

  const copyRegNumber = () => {
    navigator.clipboard.writeText(registrationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-emerald-100 text-center space-y-6">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              আলহামদুলিল্লাহ!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              রেজিস্ট্রেশন সফলভাবে জমা হয়েছে!
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              ধন্যবাদ <strong>{friendName}</strong>। মিলনমেলা–২০২৬ (সপরিবার)-এর জন্য আপনার রেজিস্ট্রেশন তথ্য ও পেমেন্ট বিবরণী সংরক্ষিত হয়েছে।
            </p>
          </div>

          {/* Registration Number Highlight Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl border border-gold-500/50 space-y-2 relative overflow-hidden">
            <span className="text-xs text-gold-300 uppercase tracking-wider font-semibold">
              আপনার অনন্য রেজিস্ট্রেশন নম্বর
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-wider font-mono text-gold-400">
              {registrationNumber}
            </div>
            <div className="pt-2">
              <button
                onClick={copyRegNumber}
                className="btn btn-xs bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                {copied ? 'কপি সম্পন্ন!' : 'নম্বরটি কপি করুন'}
              </button>
            </div>
          </div>

          {/* Registration Summary Table */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-sm space-y-2.5">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">অংশগ্রহণকারী সদস্য:</span>
              <span className="font-bold text-slate-800">{toBangla(participantCount)} জন</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">মোট প্রদেয় ফি:</span>
              <span className="font-bold text-slate-800">{toBangla(totalFee)} টাকা</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">পেমেন্ট স্ট্যাটাস:</span>
              <span className="badge badge-warning text-xs font-bold">পেন্ডিং (অপেক্ষমাণ)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">রেজিস্ট্রেশন অবস্থা:</span>
              <span className="text-slate-800 font-semibold">যাচাই প্রক্রিয়াধীন</span>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong>গুরুত্বপূর্ণ তথ্য:</strong> শুভেচ্ছা ফি প্রাপ্তি যাচাইয়ের পর অ্যাডমিন কর্তৃক আপনার রেজিস্ট্রেশন চূড়ান্তভাবে নিশ্চিত করা হবে এবং আপনার প্রদত্ত ইমেইলে নিশ্চিতকরণ পত্র পাঠানো হবে।
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/registration-status"
              className="btn btn-outline border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-1.5" /> স্ট্যাটাস দেখুন
            </Link>
            <Link
              to="/"
              className="btn btn-primary bg-emerald-800 text-white hover:bg-emerald-900 w-full sm:w-auto"
            >
              মূল পাতা <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 space-y-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-3xl font-bold text-slate-800">৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি</h1>
        <p className="text-slate-600 text-sm">
          আপনি যে ঠিকানাটি খুঁজছেন তা বিদ্যমান নেই অথবা স্থানান্তরিত হয়েছে।
        </p>
        <div className="pt-2">
          <Link to="/" className="btn btn-primary bg-emerald-800 text-white">
            মূল পাতায় ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

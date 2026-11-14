import React, { useState, useEffect } from 'react';
import { Award, Info, Trophy, Medal } from 'lucide-react';
import api from '../services/api';

export default function QuizResults() {
  const [isPublished, setIsPublished] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bengali number conversion
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/quiz/results');
        if (res.data.success) {
          setIsPublished(res.data.isPublished);
          if (res.data.isPublished && Array.isArray(res.data.data)) {
            setRankings(res.data.data);
          }
        }
      } catch {
        setIsPublished(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="py-12 lg:py-16 bg-slate-50 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰনِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            কুইজ প্রতিযোগিতার মেধা তালিকা ও ফলাফল
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            আল উয়ূন পরিষদ বার্ষিক মিলনমেলা–২০২৬ (সপরিবার) এর শিশু কুইজ ফলাফল
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 text-center">
            <span className="loading loading-spinner text-emerald-800 loading-lg"></span>
            <p className="text-xs text-slate-500 mt-2">ফলাফল যাচাই করা হচ্ছে...</p>
          </div>
        ) : !isPublished ? (
          /* STATE A: BEFORE ADMIN PUBLICATION */
          <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-sm border border-emerald-100 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-50 text-gold-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 px-5 py-2.5 rounded-2xl text-base font-bold border border-amber-200 shadow-sm">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mr-1" />
                <span>“কুইজ প্রতিযোগিতার চূড়ান্ত ফলাফল এখনো প্রকাশ করা হয়নি।”</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed pt-2">
                ১২ ডিসেম্বর ২০২৬, শনিবার কুইজ প্রতিযোগিতা সমাপ্ত হওয়ার পর বিকেল ৫:৪৫ মিনিটে বার্ষিক সাধারণ সভায় ফলাফল ঘোষণা এবং পরবর্তীতে অ্যাডমিন কর্তৃক ওয়েবসাইটে মেধা তালিকা প্রকাশ করা হবে।
              </p>
            </div>
          </div>
        ) : (
          /* STATE B: ONLY AFTER ADMIN PUBLISHES RESULTS */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top 3 Winners Podium Banner */}
            {rankings.length >= 3 && (
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/50 space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    অভিনন্দন!
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center">
                    <Trophy className="w-7 h-7 mr-2 text-gold-400" />
                    শীর্ষ তিন কুইজ চ্যাম্পিয়ন
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {rankings.slice(0, 3).map((winner) => (
                    <div
                      key={winner.rank}
                      className="bg-emerald-950/80 p-5 rounded-2xl border border-gold-500/40 text-center space-y-2 relative overflow-hidden"
                    >
                      <div className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                        {winner.rank === 1 && '১ম স্থান (চ্যাম্পিয়ন)'}
                        {winner.rank === 2 && '২য় স্থান (রানার-আপ)'}
                        {winner.rank === 3 && '৩য় স্থান'}
                      </div>
                      <div className="text-xl font-bold text-white mt-1">
                        {winner.childName}
                      </div>
                      <div className="text-xs text-emerald-200">
                        পিতা: {winner.fatherName}
                      </div>
                      <div className="pt-2 border-t border-emerald-800 text-sm font-mono font-bold text-gold-400">
                        স্কোর: {toBangla(winner.score)}/{toBangla(winner.totalMarks || 10)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Ranking Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-3">
                সম্পূর্ণ মেধা তালিকা
              </h3>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-700 text-sm">
                      <th className="py-3">স্থান (Rank)</th>
                      <th>শিশুর নাম</th>
                      <th>পিতার নাম</th>
                      <th className="text-center">প্রাপ্ত স্কোর</th>
                      <th>সমাপ্তির সময়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {rankings.map((item) => (
                      <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold py-3.5">
                          {item.rank <= 3 ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <Medal className="w-3.5 h-3.5 text-gold-600" />
                              <span>{toBangla(item.rank)}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 px-3">{toBangla(item.rank)}</span>
                          )}
                        </td>
                        <td className="font-bold text-slate-900">{item.childName}</td>
                        <td className="text-slate-600">{item.fatherName}</td>
                        <td className="text-center font-mono font-bold text-emerald-800">
                          {toBangla(item.score)}/{toBangla(item.totalMarks || 10)}
                        </td>
                        <td className="text-xs text-slate-500 font-mono">{toBangla(item.completionTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                গোপনীয়তা ও শিশু সুরক্ষা বিধিমালার কারণে অভিভাবকদের কোনো ব্যক্তিগত ফোন নম্বর এখানে প্রদর্শিত হয় না।
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

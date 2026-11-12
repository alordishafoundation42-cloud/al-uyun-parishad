import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck, CheckCircle } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰনِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            গোপনীয়তা নীতিমালা (Privacy Policy)
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            আল উয়ূন পরিষদ — বার্ষিক পারিবারিক মিলনমেলা–২০২৬ এর তথ্য সুরক্ষা ও গোপনীয়তা সংক্রান্ত অঙ্গীকার
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-emerald-100 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-medium">
            আসসালামু আলাইকুম। আল উয়ূন পরিষদের পারিবারিক মিলনমেলার এই প্ল্যাটফর্মে আপনার এবং আপনার পরিবারের সকল সম্মানিত সদস্যদের ব্যক্তিগত তথ্যের সর্বোচ্চ নিরাপত্তা ও পবিত্রতা বজায় রাখা আমাদের নৈতিক ও ইসলামিক দায়িত্ব।
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-emerald-800" />
              ১. কী কী তথ্য আমরা সংগ্রহ করি
            </h2>
            <p>
              মিলনমেলার সুষ্ঠু ব্যবস্থাপনা, খাবার ও উপহারের নির্ভুল হিসাবের জন্য আমরা কেবল প্রয়োজনীয় তথ্য সংগ্রহ করি:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>নিবন্ধিত বন্ধুর নাম, মোবাইল নম্বর, ইমেইল, পেশা ও শিক্ষাগত যোগ্যতা।</li>
              <li>বর্তমান ও গ্রামের স্থায়ী ঠিকানা।</li>
              <li>অংশগ্রহণকারী পরিবারের সদস্যদের নাম, বয়স, লিঙ্গ ও সম্পর্ক।</li>
              <li>শুভেচ্ছা ফির পেমেন্ট মাধ্যম, ট্রানজ্যাকশন আইডি ও প্রেরক নম্বর।</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <EyeOff className="w-5 h-5 mr-2 text-emerald-800" />
              ২. তথ্যের কঠোর অপ্রকাশ্যতা (Strict Non-Disclosure)
            </h2>
            <p>
              আপনার বা আপনার পরিবারের কোনো তথ্য বাণিজ্যিক উদ্দেশ্যে ব্যবহৃত বা কোনো তৃতীয় পক্ষের সাথে আদান-প্রদান করা হবে না।
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm space-y-1 text-slate-700">
              <p>• <strong>পাবলিক স্ট্যাটাস:</strong> রেজিস্ট্রেশন স্ট্যাটাস পেজে মোবাইল নম্বর, ইমেইল, ঠিকানা বা পরিবারের সদস্যদের নাম কখনোই সর্বজনীন দেখানো হয় না।</p>
              <p>• <strong>কুইজ ফলাফল:</strong> কুইজের পাবলিক রেজাল্টে বাবার ফোন নম্বর বা ব্যক্তিগত তথ্য প্রদর্শন সম্পূর্ণ নিষিদ্ধ।</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-emerald-800" />
              ৩. শিশু নিরাপত্তা ও কুইজ ডাটা
            </h2>
            <p>
              ভেন্যুতে অনুষ্ঠিতব্য কুইজ প্রতিযোগিতায় অংশগ্রহণকারী শিশুদের কোনো অপ্রয়োজনীয় সংবেদনশীল তথ্য সংগ্রহ করা হয় না। কুইজে অংশগ্রহণের পর প্রাপ্ত নম্বর ও মেধা তালিকা ব্যতীত শিশুদের কোনো ব্যক্তিগত ডাটা জনসম্মুখে উন্মুক্ত করা হয় না।
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-emerald-800" />
              ৪. তথ্য সংরক্ষণ ও মুছে ফেলা
            </h2>
            <p>
              মিলনমেলা–২০২৬ সমাপ্তির পর যাবতীয় অভ্যন্তরীণ হিসাব ও নথিপত্র কেবলমাত্র পরিষদের আনুষ্ঠানিক স্মারক হিসেবে সংরক্ষিত থাকবে। কোনো সদস্য চাইলে তাঁর ডাটা সংশোধন বা হালনাগাদ করার জন্য সমন্বয়কের সাথে যোগাযোগ করতে পারেন।
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
            সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬ • আল উয়ূন পরিষদ — বার্ষিক পারিবারিক মিলনমেলা–২০২৬
          </div>

        </div>

      </div>
    </div>
  );
}

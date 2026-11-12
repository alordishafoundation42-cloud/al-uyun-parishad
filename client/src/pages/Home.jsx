import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Gift,
  HelpCircle
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

export default function Home() {
  const schedulePreview = [
    { time: 'সকাল ১০:০০টা', title: 'হোটেলে উপস্থিতি ও জমায়েত' },
    { time: 'সকাল ১০:৩০–দুপুর ১:০০', title: 'নাশতা, স্মৃতিচারণ ও কুইজ প্রতিযোগিতা' },
    { time: 'দুপুর ১:০০টা', title: 'জোহরের নামাজ ও দুপুরের খাবার' },
    { time: 'দুপুর ২:৩০–বিকেল ৫:৩০', title: 'সিআরবি ও পতেঙ্গা সমুদ্রসৈকত ভ্রমণ' },
    { time: 'বিকেল ৫:৪৫–সন্ধ্যা ৬:১৫', title: 'বার্ষিক সাধারণ সভা ও পুরস্কার বিতরণ' },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-emerald-950 text-white overflow-hidden py-16 lg:py-24 border-b-4 border-gold-600">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="inline-block text-gold-400 font-serif text-xl sm:text-2xl tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              আল উয়ূন পরিষদ
            </h1>
            <div className="text-xl sm:text-3xl font-semibold text-gold-400">
              বার্ষিক পারিবারিক মিলনমেলা–২০২৬
            </div>
          </div>

          <p className="max-w-3xl mx-auto text-emerald-100 text-base sm:text-lg leading-relaxed pt-2">
            বন্ধুত্বের বন্ধন সুদৃঢ় করা, পারস্পরিক সৌহার্দ্য বৃদ্ধি এবং পরিবার-পরিজনসহ আনন্দঘন কিছু স্মরণীয় মুহূর্ত কাটানোর প্রত্যয়ে আমাদের এ বিশেষ আয়োজন।
          </p>

          {/* Countdown Timer */}
          <div className="pt-2">
            <div className="text-xs uppercase tracking-widest text-gold-400/90 font-semibold mb-2">
              মিলনমেলার বাকি আর মাত্র
            </div>
            <CountdownTimer targetDate="2026-12-12T10:00:00+06:00" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/registration"
              className="btn btn-primary bg-gold-500 hover:bg-gold-600 text-emerald-950 border-none font-bold px-8 shadow-xl hover:shadow-2xl w-full sm:w-auto text-base hover:scale-105 transition-all"
            >
              রেজিস্ট্রেশন করুন
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/event-details"
              className="btn btn-outline border-emerald-400 text-emerald-100 hover:bg-emerald-900 hover:border-gold-400 w-full sm:w-auto text-base"
            >
              বিস্তারিত অনুষ্ঠানসূচি
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EVENT KEY HIGHLIGHTS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-emerald-700 hover:shadow-xl transition-shadow flex items-start space-x-4">
            <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-800 shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">তারিখ ও বার</h3>
              <p className="text-emerald-800 font-semibold text-base mt-1">১২ ডিসেম্বর ২০২৬, শনিবার</p>
              <p className="text-slate-500 text-sm mt-0.5">সকাল ১০:০০টা হতে সন্ধ্যা ৬:১৫টা</p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-gold-600 hover:shadow-xl transition-shadow flex items-start space-x-4">
            <div className="p-3.5 bg-amber-50 rounded-2xl text-gold-700 shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">মিলনমেলা ভেন্যু</h3>
              <p className="text-emerald-800 font-semibold text-base mt-1">হোটেল সৈকত, সাঙ্গু হল</p>
              <p className="text-slate-500 text-sm mt-0.5">স্টেশন রোড, চট্টগ্রাম</p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-emerald-700 hover:shadow-xl transition-shadow flex items-start space-x-4">
            <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-800 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">শুভেচ্ছা ফি</h3>
              <p className="text-emerald-800 font-semibold text-base mt-1">১,০০০ টাকা (জনপ্রতি)</p>
              <p className="text-slate-500 text-sm mt-0.5">বন্ধু ও সকল পরিবারের সদস্যের জন্য</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCHEDULE PREVIEW & SPECIAL ATTRACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Schedule Preview */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-gold-600" />
                  অনুষ্ঠানসূচি একনজরে
                </h2>
                <p className="text-slate-500 text-sm mt-1">১২ ডিসেম্বর ২০২৬, শনিবারের কার্যক্রম</p>
              </div>
              <Link to="/event-details" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 flex items-center">
                পূর্ণাঙ্গ সূচি <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {schedulePreview.map((item, index) => (
                <div key={index} className="flex items-center p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 transition-colors">
                  <span className="w-44 sm:w-48 text-sm font-bold text-emerald-900 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-sm text-slate-700 font-medium">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-sm text-emerald-900 leading-relaxed">
              <strong>বিশেষ দ্রষ্টব্য:</strong> জোহরের নামাজ ও খাবারের পর নারী ও পুরুষের পৃথক পৃথক গাড়িতে সিআরবি ও পরবর্তীতে পতেঙ্গা সমুদ্রসৈকত পরিদর্শনের ব্যবস্থা থাকবে।
            </div>
          </div>

          {/* Special Attractions / Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-gold-600/40 space-y-5">
              <div className="flex items-center space-x-2 text-gold-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider font-bold">মিলনমেলার বিশেষ আকর্ষণ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                পুরস্কার, উপহার ও সৌহার্দ্য
              </h3>
              <ul className="space-y-3.5 text-sm text-emerald-100">
                <li className="flex items-start">
                  <Gift className="w-5 h-5 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>স্মারক উপহার:</strong> মিলনমেলার পক্ষ থেকে প্রত্যেক বন্ধুকে প্রতিবারের ন্যায় একটি করে উপহার প্রদান করা হবে।</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>দ্রুত রেজিস্ট্রেশন পুরস্কার:</strong> সর্বপ্রথম তথ্য পূরণ ও শুভেচ্ছা ফি জমাদানকারী তিনজন বন্ধুকে বিশেষ পুরস্কার।</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>কুইজ বিজয়ী পুরস্কার:</strong> শিশুদের কুইজ প্রতিযোগিতায় শীর্ষ তিনজন বিজয়ীকে বিশেষ সম্মাননা ও পুরস্কার।</span>
                </li>
              </ul>
            </div>

            {/* Quick Status Lookup Banner */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">ইতিমধ্যে রেজিস্ট্রেশন করেছেন?</h4>
                <p className="text-slate-500 text-xs mt-1">রেজিস্ট্রেশন নম্বর দিয়ে বর্তমান অবস্থা যাচাই করুন</p>
              </div>
              <Link
                to="/registration-status"
                className="btn btn-sm btn-outline border-emerald-700 text-emerald-800 hover:bg-emerald-800 hover:text-white"
              >
                স্ট্যাটাস দেখুন
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEE CALCULATION EXPLANATION CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-3xl p-8 sm:p-10 border border-gold-200 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-gold-700 font-bold text-sm bg-white px-3 py-1 rounded-full border border-gold-300">
              <Users className="w-4 h-4" />
              <span>শুভেচ্ছা ফি সংক্রান্ত গুরুত্বপূর্ণ নিয়ম</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              প্রতি অংশগ্রহণকারীর শুভেচ্ছা ফি ১,০০০ টাকা
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              বন্ধু, স্বামী/স্ত্রী, সন্তান এবং পরিবারের যেসব সদস্য মিলনমেলায় অংশগ্রহণ করবেন, <strong>প্রত্যেকের জন্যই ১,০০০ টাকা করে ফি প্রযোজ্য হবে</strong>।
            </p>
            <div className="p-4 bg-white/80 rounded-xl border border-emerald-200 text-sm text-slate-800 space-y-1">
              <p><strong>উদাহরণ:</strong> ১ জন মূল বন্ধু + স্ত্রী + ২ সন্তান = মোট ৪ জন অংশগ্রহণকারী = ৪,০০০ টাকা।</p>
              <p className="text-xs text-slate-500">অনলাইন রেজিস্ট্রেশন ফর্মে সদস্য যোগ করার সাথে সাথে মোট ফি স্বয়ংক্রিয়ভাবে হিসাব হয়ে যাবে।</p>
            </div>
            <div className="pt-2">
              <Link to="/registration" className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-medium">
                এখনই পরিবারসহ রেজিস্ট্রেশন করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUIZ COMPETITION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gold-500/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-gold-400/60 px-3.5 py-1 rounded-full text-gold-300 text-xs sm:text-sm font-semibold">
              <Award className="w-4 h-4 mr-1 text-gold-400" />
              <span>শিশুদের বিশেষ প্রতিযোগিতা</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              ১২ ডিসেম্বর ভেন্যুতে শিশুদের কুইজ প্রতিযোগিতা
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              সকাল ১১:০০টায় অনুষ্ঠানস্থলে বন্ধুদের সন্তানদের জন্য ২০ মিনিটের বিশেষ ডিজিটাল কুইজ প্রতিযোগিতা অনুষ্ঠিত হবে।
            </p>
            <ul className="text-xs sm:text-sm text-emerald-200 space-y-1.5 list-disc list-inside">
              <li>কেবলমাত্র নিবন্ধিত বন্ধুদের নিবন্ধিত সন্তানেরা অংশগ্রহণ করতে পারবে।</li>
              <li>সর্বোচ্চ নম্বরপ্রাপ্ত ৩ জন বিজয়ীকে বিশেষ পুরস্কার প্রদান করা হবে।</li>
            </ul>
            <div className="pt-3 flex flex-wrap gap-3">
              <Link to="/quiz" className="btn bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold border-none">
                কুইজের বিস্তারিত নিয়মাবলী
              </Link>
              <Link to="/quiz-results" className="btn btn-outline border-emerald-300 text-emerald-100 hover:bg-emerald-800">
                ফলাফল পাতা
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT & PAYMENT COORDINATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-gold-700 font-bold text-xs uppercase tracking-wider bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
              <Phone className="w-3.5 h-3.5" />
              <span>পেমেন্ট ও জরুরি যোগাযোগ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              কাজী একেএম সাইফুদ্দিন মামুন
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              শুভেচ্ছা ফি বিকাশ অথবা ব্যাংক অ্যাকাউন্টের মাধ্যমে জমা দেওয়া যাবে। পেমেন্টের বিস্তারিত তথ্য ও রেজিস্ট্রেশন নিশ্চিত করতে যোগাযোগ করুন।
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <div className="text-xs text-emerald-800 font-semibold uppercase">বিকাশ ও সরাসরি মোবাইল নম্বর</div>
              <div className="text-2xl font-extrabold text-emerald-950 font-mono tracking-wider">
                +880 1819-173608
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">রেজিস্ট্রেশন সহায়তা নির্দেশিকা</h3>
            <ul className="text-sm text-slate-600 space-y-2.5">
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                <span>অনলাইন ফরমে সঠিক তথ্য ও অংশগ্রহণকারী সকল সদস্যের বিবরণ দিন।</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                <span>বিকাশ বা ব্যাংকে শুভেচ্ছা ফি পাঠিয়ে ট্রানজ্যাকশন আইডি ও প্রেরক নম্বরটি দিন।</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                <span>অ্যাডমিন ভেরিফিকেশনের পর ইমেইলে নিশ্চয়তা পত্র ও টিকিট পাবেন।</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/contact" className="text-sm font-semibold text-emerald-800 hover:underline">
                আরও বিস্তারিত জানতে যোগাযোগ পেজ দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

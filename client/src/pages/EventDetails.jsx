import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  Phone, 
  Users, 
  Gift, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2
} from 'lucide-react';

export default function EventDetails() {
  const scheduleItems = [
    {
      time: 'সকাল ১০:০০টা',
      title: 'হোটেলে উপস্থিতি ও জমায়েত',
      description: 'নিবন্ধিত বন্ধু ও পরিবারবর্গের উপস্থিতি, ব্যাজ ও স্বাগত অভ্যর্থনা গ্রহণ।'
    },
    {
      time: 'সকাল ১০:৩০টা – দুপুর ১:০০টা',
      title: 'নাস্তা, পরিচয় পর্ব, স্মৃতিচারণ, অভিব্যক্তি প্রকাশ ও কুইজ প্রতিযোগিতা',
      description: 'উপস্থিত সকলের পরিচয় পর্ব, অতীতের স্মৃতি রোমন্থন, মুক্ত আলোচনা এবং শিশুদের বিশেষ ডিজিটাল কুইজ প্রতিযোগিতা।'
    },
    {
      time: 'দুপুর ১:০০টা',
      title: 'জোহরের নামাজ',
      description: 'জামাতের সাথে জোহরের নামাজ আদায়।'
    },
    {
      time: 'দুপুর ১:১৫টা',
      title: 'দুপুরের খাবার',
      description: 'পরিবারসহ সুস্বাদু ঐতিহ্যবাহী মধ্যাহ্নভোজ।'
    },
    {
      time: 'দুপুর ২:০০টা – ২:১৫টা',
      title: 'ফটো সেশন',
      description: 'সকল বন্ধু এবং পরিবারবর্গের সমন্বয়ে গ্রুপ ফটো সেশন ও স্মৃতি সংরক্ষণ।'
    },
    {
      time: 'দুপুর ২:৩০টা – ৩:০০টা',
      title: 'নারী ও পুরুষের পৃথক গাড়িতে সিআরবি যাত্রা',
      description: 'শৃঙ্খলা ও পর্দার সাথে নারী ও পুরুষদের জন্য পৃথক যানবাহনে সিআরবি অভিমুখে যাত্রা।'
    },
    {
      time: 'বিকেল ৩:০০টা',
      title: 'সিআরবি থেকে পতেঙ্গা সমুদ্রসৈকতের উদ্দেশ্যে যাত্রা',
      description: 'প্রাকৃতিক সৌন্দর্য উপভোগ এবং পতেঙ্গা সৈকত ভ্রমণ।'
    },
    {
      time: 'বিকেল ৪:১৫টা – ৪:৩০টা',
      title: 'আসরের নামাজ',
      description: 'সমুদ্রসৈকত সংলগ্ন জামাতে আসরের নামাজ আদায়।'
    },
    {
      time: 'বিকেল ৫:৩০টা',
      title: 'মাগরিবের নামাজ',
      description: 'মাগরিবের নামাজ আদায়।'
    },
    {
      time: 'বিকেল ৫:৪৫টা – ৬:১৫টা',
      title: 'বার্ষিক ও সাধারণ সভা, পুরস্কার ও উপহার বিতরণ',
      description: 'বার্ষিক পর্যালোচনা, কুইজ ও দ্রুত রেজিস্ট্রেশনের বিশেষ পুরস্কার প্রদান এবং স্মারক উপহার হস্তান্তর।'
    },
    {
      time: 'সন্ধ্যা ৬:১৫টা',
      title: 'শহরের উদ্দেশ্যে যাত্রা',
      description: 'পরম সৌহার্দ্য ও দোয়ার সাথে মিলনমেলার আনুষ্ঠানিক সমাপ্তি ও প্রস্থান।'
    }
  ];

  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-block text-gold-600 font-serif text-xl sm:text-2xl tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-950">
            আল উয়ূন পরিষদ
          </h1>
          <div className="text-xl sm:text-2xl font-bold text-gold-700">
            বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ। আলহামদুলিল্লাহ! মহান আল্লাহর অশেষ রহমতে আগামী ১২ ডিসেম্বর ২০২৬, শনিবার আল উয়ূন পরিষদের বার্ষিক মিলনমেলা (সপরিবার) অনুষ্ঠিত হতে যাচ্ছে।
          </p>
        </div>

        {/* Introduction & Venue Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-6">
          <div className="prose max-w-none text-slate-700 text-base sm:text-lg leading-relaxed">
            বন্ধুত্বের বন্ধন সুদৃঢ় করা, পারস্পরিক সৌহার্দ্য বৃদ্ধি এবং পরিবার-পরিজনসহ আনন্দঘন কিছু স্মরণীয় মুহূর্ত কাটানোর প্রত্যয়ে এ  আয়োজন।
          </div>

          <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <MapPin className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">অনুষ্ঠানস্থল (Venue)</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">হোটেল সৈকত, সাঙ্গু হল</h3>
                <p className="text-slate-600 text-sm">স্টেশন রোড, চট্টগ্রাম</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold bg-white px-4 py-2 rounded-xl border border-emerald-200 text-emerald-900 shrink-0">
              <Calendar className="w-4 h-4 text-gold-600" />
              <span>১২ ডিসেম্বর ২০২৬, শনিবার</span>
            </div>
          </div>
        </div>

        {/* Event Schedule (অনুষ্ঠানসূচি) Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-8">
          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-gold-600" />
              অনুষ্ঠানসূচি
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              দিনের প্রতিটি পর্বের সুশৃঙ্খল ও নির্ধারিত সময়সূচি
            </p>
          </div>

          <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
            {scheduleItems.map((item, index) => (
              <div key={index} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-700 group-hover:border-gold-500 transition-colors"></div>
                
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
                    {item.time}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration & Fee Information (রেজিস্ট্রেশন ও শুভেচ্ছা ফি) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 flex items-center">
              <Users className="w-7 h-7 mr-3 text-gold-600" />
              রেজিস্ট্রেশন ও শুভেচ্ছা ফি
            </h2>
            <p className="text-slate-500 text-sm mt-1">অংশগ্রহণ ফি ও বিশেষ পুরস্কার নীতিমালা</p>
          </div>

          <div className="bg-amber-50/70 border-l-4 border-gold-600 p-5 rounded-r-2xl space-y-2">
            <p className="text-slate-800 font-semibold text-lg">
              প্রতি অংশগ্রহণকারীর শুভেচ্ছা ফি ১,০০০/- (এক হাজার) টাকা নির্ধারণ করা হয়েছে।
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              বন্ধু, স্ত্রী, সন্তান এবং পরিবারের যেসব সদস্য মিলনমেলায় অংশগ্রহণ করবেন, <strong>প্রত্যেকের জন্য ১,০০০ টাকা করে ফি প্রযোজ্য হবে (৩ বছরের শিশুর জন্য কোনো ফি লাগবে না)</strong>।
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 text-sm">
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-700 mr-2 mt-0.5 shrink-0" />
              <span>নির্ধারিত অনলাইন ফরমে নিজের ও পরিবারের অংশগ্রহণকারী সদস্যদের প্রয়োজনীয় তথ্য পূরণ করতে হবে।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-700 mr-2 mt-0.5 shrink-0" />
              <span>অংশগ্রহণকারীর মোট সংখ্যা অনুযায়ী শুভেচ্ছা ফি স্বয়ংক্রিয়ভাবে হিসাব হবে (৩ বছর বা তার কম শিশুর জন্য ফি প্রযোজ্য নয়)।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-700 mr-2 mt-0.5 shrink-0" />
              <span>ব্যাংক অ্যাকাউন্ট অথবা বিকাশের মাধ্যমে শুভেচ্ছা ফি জমা দিয়ে রেজিস্ট্রেশন সম্পন্ন করতে হবে।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <Gift className="w-5 h-5 text-gold-600 mr-2 mt-0.5 shrink-0" />
              <span>মিলনমেলার পক্ষ থেকে প্রত্যেক বন্ধুদের এবং তাঁদের স্ত্রীদেরকে একটি করে উপহার দেওয়া হবে।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <Award className="w-5 h-5 text-gold-600 mr-2 mt-0.5 shrink-0" />
              <span>প্রতিযোগিতায় অংশগ্রহণকারী প্রথম ৩ জনকে বিশেষ এবং বাকিদেরকে সাধারণ পুরস্কার দেওয়া হবে।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl">
              <Award className="w-5 h-5 text-gold-600 mr-2 mt-0.5 shrink-0" />
              <span>কুইজ প্রতিযোগিতায় অংশগ্রহণকারী শীর্ষ তিনজন প্রতিযোগীকে বিশেষ পুরস্কার দেওয়া হবে।</span>
            </li>
            <li className="flex items-start p-3 bg-slate-50 rounded-xl md:col-span-2">
              <Award className="w-5 h-5 text-gold-600 mr-2 mt-0.5 shrink-0" />
              <span>সর্বপ্রথম তথ্য পূরণ ও রেজিস্ট্রেশন ফি জমাদানকারী <strong>তিনজন বন্ধুকে বিশেষ পুরস্কার</strong> দেওয়া হবে।</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link to="/registration" className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 shadow">
              অনলাইনে রেজিস্ট্রেশন করুন <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Quiz Competition Section (কুইজ প্রতিযোগিতা) */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gold-500/50 space-y-6">
          <div className="flex items-center space-x-3 border-b border-emerald-800 pb-4">
            <Award className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">কুইজ প্রতিযোগিতা</h2>
              <p className="text-emerald-200 text-sm mt-0.5">১২ ডিসেম্বর ২০২৬, শনিবার সকাল ১১:০০টা (অনুষ্ঠানস্থলে)</p>
            </div>
          </div>

          <p className="text-emerald-100 text-base leading-relaxed">
            ১২ ডিসেম্বর ২০২৬, শনিবার সকাল ১১:০০টায় অনুষ্ঠানস্থলে শিশুদের জন্য বিশেষ কুইজ প্রতিযোগিতা অনুষ্ঠিত হবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-emerald-100">
            <div className="p-4 bg-emerald-950/70 rounded-2xl border border-emerald-800 space-y-1">
              <span className="font-bold text-gold-400">অংশগ্রহণের যোগ্যতা</span>
              <p>কেবল নিবন্ধিত বন্ধুদের নিবন্ধিত সন্তানরা অংশগ্রহণ করতে পারবে।</p>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-2xl border border-emerald-800 space-y-1">
              <span className="font-bold text-gold-400">সময়সীমা</span>
              <p>প্রতিটি শিশুর জন্য ২০ মিনিট সময় নির্ধারিত থাকবে।</p>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-2xl border border-emerald-800 space-y-1">
              <span className="font-bold text-gold-400">প্রতিযোগিতার ধরন</span>
              <p>শিশুদের উপযোগী বিশেষ কুইজ প্রতিযোগিতা অনুষ্ঠিত হবে।</p>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-2xl border border-emerald-800 space-y-1">
              <span className="font-bold text-gold-400">পুরস্কার</span>
              <p>সর্বোচ্চ নম্বরপ্রাপ্ত তিনজনকে বিশেষ সম্মাননা ও পুরস্কার প্রদান করা হবে।</p>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/quiz" className="btn bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold border-none">
              কুইজের বিস্তারিত পাতা দেখুন
            </Link>
          </div>
        </div>

        {/* Payment & Contact Section (পেমেন্ট ও যোগাযোগ) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 flex items-center">
              <Phone className="w-7 h-7 mr-3 text-gold-600" />
              পেমেন্ট মাধ্যম ও শুভেচ্ছা ফি জমাদান
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              অংশগ্রহণকারী বন্ধুরা বিকাশ পার্সোনাল অথবা সরাসরি ব্যাংকে শুভেচ্ছা ফি জমা দিতে পারবেন।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* bKash Payment Box */}
            <div className="p-6 bg-gradient-to-br from-pink-50/60 to-rose-50/40 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center justify-between border-b border-pink-200/80 pb-2">
                <span className="text-xs font-bold text-pink-800 uppercase tracking-wider">মাধ্যম ১ : বিকাশ (bKash)</span>
                <span className="badge badge-sm bg-pink-700 text-white border-none">পার্সোনাল</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-500">প্রাপক ও সমন্বয়ক:</div>
                <div className="text-lg font-bold text-slate-900">কাজী একেএম সাইফুদ্দিন মামুন</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-500">বিকাশ মোবাইল নম্বর:</div>
                <div className="text-2xl font-extrabold font-mono text-pink-700 tracking-wider">
                  +880 1819-173608
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                * বিকাশ অ্যাপ বা ডায়াল করে Send Money করার পর ট্রানজ্যাকশন আইডি (TrxID) সংরক্ষণ করুন।
              </p>
            </div>

            {/* Bank Deposit Box */}
            <div className="p-6 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                  <Building2 className="w-4 h-4 mr-1 text-emerald-700" />
                  মাধ্যম ২ : ব্যাংক একাউন্ট (Bank Deposit)
                </span>
                <span className="badge badge-sm bg-emerald-800 text-white border-none">ইসলামী ব্যাংক</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500">ব্যাংকের নাম:</span>
                  <div className="font-bold text-slate-900">আল-আরাফাহ্ ইসলামী ব্যাংক লিমিটেড</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">শাখা:</span>
                  <div className="font-bold text-slate-900">মুরাদপুর শাখা, চট্টগ্রাম</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500">হিসাবের নাম (Account Name):</span>
                  <div className="font-bold text-slate-900 font-mono tracking-wide">ALYOUN PORISHAD</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500">হিসাব নম্বর (Mudaraba Savings A/C No):</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-900 tracking-wider">
                    1091120017273
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                * ব্যাংকে সরাসরি জমা বা অনলাইন ট্রান্সফার করে ডিপোজিট স্লিপ নম্বর বা রেফারেন্স সংরক্ষণ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Cordial Invitation (আন্তরিক আমন্ত্রণ) */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl border border-gold-500/40">
          <div className="w-12 h-12 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-400">আন্তরিক আমন্ত্রণ</h2>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            আসুন, পারস্পরিক ভালোবাসা, শ্রদ্ধা ও ভ্রাতৃত্বের বন্ধনে পরিবার-পরিজনসহ একত্রিত হই। মহান আল্লাহ আমাদের এ আয়োজনকে কবুল করুন এবং আমাদের বন্ধুত্বের বন্ধন অটুট রাখুন। আমিন।
          </p>
          <p className="text-sm text-emerald-200">
            সকল বন্ধু ও তাঁদের পরিবারের সদস্যদের আন্তরিক আমন্ত্রণ ও স্বতঃস্ফূর্ত অংশগ্রহণ কামনা করছি।
          </p>
          <div className="pt-4 text-gold-400 font-semibold">
            ওয়াসসালাম।<br />
            <span className="text-xl font-bold text-white">আল উয়ূন পরিষদ</span>
          </div>
        </div>

      </div>
    </div>
  );
}

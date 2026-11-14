import React from 'react';
import { Phone, MapPin, Calendar, Clock, CreditCard, HelpCircle, MessageSquare, Building2 } from 'lucide-react';

export default function Contact() {
  const faqs = [
    {
      q: 'শুভেচ্ছা ফি কার কার জন্য প্রযোজ্য হবে?',
      a: 'মিলনমেলায় অংশগ্রহণকারী প্রত্যেক ব্যক্তির জন্য (মূল বন্ধু, স্ত্রী/স্বামী, সন্তান এবং পরিবারের অন্যান্য সদস্য) ১,০০০ টাকা করে শুভেচ্ছা ফি প্রযোজ্য হবে।'
    },
    {
      q: 'বিকাশ ছাড়া কি ব্যাংক অ্যাকাউন্টে ফি দেওয়া যাবে?',
      a: 'হ্যাঁ, আল-আরাফাহ্ ইসলামী ব্যাংক লিমিটেড (মুরাদপুর শাখা)-এ ALYOUN PORISHAD হিসাব নম্বরে (১০৯১১২০০১৭২৭৩) সরাসরি ফি জমা দেওয়া যাবে।'
    },
    {
      q: 'রেজিস্ট্রেশনের পর পেমেন্ট কনফার্মেশন কীভাবে পাব?',
      a: 'পেমেন্ট জমা দেওয়ার পর অ্যাডমিন ম্যানুয়ালি যাচাই করবেন। যাচাই সম্পন্ন হলে আপনার প্রদত্ত ইমেইল ঠিকানায় স্বয়ংক্রিয় কনফার্মেশন মেইল ও টিকিট পাঠানো হবে।'
    },
    {
      q: 'কুইজ প্রতিযোগিতায় কারা অংশ নিতে পারবে?',
      a: 'রেজিস্ট্রেশন ফর্মে অন্তর্ভুক্ত বন্ধুদের সন্তানরা ভেন্যুতে অনুষ্ঠিত কুইজ প্রতিযোগিতায় অংশ নিতে পারবে।'
    }
  ];

  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰনِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            যোগাযোগ ও পেমেন্ট তথ্য
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার) এর যেকোনো প্রয়োজনে যোগাযোগ করুন।
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Payment & Coordination */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center space-x-3 text-emerald-900 border-b border-emerald-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-gold-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">পেমেন্ট ও সমন্বয়ক</h2>
                  <p className="text-xs text-slate-500">বিকাশ ও ব্যাংক একাউন্টে শুভেচ্ছা ফি জমাদান</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Coordinator & bKash */}
                <div className="p-5 bg-pink-50/70 rounded-2xl border border-pink-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-800 uppercase tracking-wider">বিকাশ (পার্সোনাল) ও সমন্বয়ক</span>
                    <span className="badge badge-sm bg-pink-700 text-white border-none">Send Money</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">কাজী একেএম সাইফুদ্দিন মামুন</div>
                  <div className="text-2xl font-extrabold font-mono text-pink-700">
                    +880 1819-173608
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center">
                      <Building2 className="w-4 h-4 mr-1 text-emerald-700" />
                      ব্যাংক একাউন্ট বিবরণী
                    </span>
                    <span className="badge badge-sm bg-emerald-800 text-white border-none">AIBL</span>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                    <div><strong>ব্যাংক:</strong> আল-আরাফাহ্ ইসলামী ব্যাংক লিমিটেড</div>
                    <div><strong>শাখা:</strong> মুরাদপুর শাখা, চট্টগ্রাম</div>
                    <div><strong>হিসাবের নাম:</strong> <span className="font-mono font-bold">ALYOUN PORISHAD</span></div>
                    <div><strong>হিসাবের ধরন:</strong> মুদারাবা সঞ্চয়ী হিসাব (MSD)</div>
                    <div><strong>হিসাব নম্বর:</strong> <span className="font-mono font-extrabold text-emerald-950 text-base">1091120017273</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              * বিকাশ বা ব্যাংকে ফি পাঠিয়ে প্রাপ্ত ট্রানজ্যাকশন আইডি (TrxID) বা ব্যাংক ডিপোজিট রেফারেন্স নম্বর দিয়ে অনলাইন রেজিস্ট্রেশন সম্পন্ন করুন।
            </div>
          </div>

          {/* Card 2: Event Venue & Schedule */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center space-x-3 text-emerald-900 border-b border-emerald-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">ভেন্যু ও সময়সূচি</h2>
                  <p className="text-xs text-slate-500">মিলনমেলা অনুষ্ঠানের স্থান</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">অনুষ্ঠানস্থল (Venue)</span>
                  <div className="text-lg font-bold text-slate-900">হোটেল সৈকত, সাঙ্গু হল</div>
                  <p className="text-sm text-slate-600">স্টেশন রোড, চট্টগ্রাম, বাংলাদেশ</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-semibold text-sm">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <span>১২ ডিসেম্বর ২০২৬, শনিবার</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 text-sm">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>সকাল ১০:০০টা হতে সন্ধ্যা ৬:১৫টা পর্যন্ত</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Hotel+Saikat+Chittagong"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white w-full"
              >
                গুগল ম্যাপে ভেন্যু দেখুন
              </a>
            </div>
          </div>

        </div>

        {/* Frequently Asked Questions (FAQ) */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-emerald-100 space-y-6">
          <div className="flex items-center space-x-3 border-b border-emerald-100 pb-4">
            <HelpCircle className="w-7 h-7 text-gold-600" />
            <h2 className="text-2xl font-bold text-emerald-950">সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর (FAQ)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base flex items-start">
                  <span className="text-gold-600 mr-2">প্রশ্ন:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

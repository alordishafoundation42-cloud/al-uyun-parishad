import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Phone, Mail, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-slate-200 border-t-4 border-gold-600">
      {/* Decorative top accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-emerald-800/60">
          
          {/* Column 1: Organization & Event info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900 border-2 border-gold-500 flex items-center justify-center text-gold-400 font-bold text-lg">
                আউ
              </div>
              <h3 className="text-xl font-bold text-gold-400">
                আল উয়ূন পরিষদ
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)। বন্ধুত্বের অটুট বন্ধন সুদৃঢ় করতে ও পরিবার-পরিজনসহ আনন্দঘন মুহূর্ত কাটানোর এক আন্তরিক মিলনমেলা।
            </p>
            <div className="pt-2 text-xs text-gold-300">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Column 2: Event Details & Venue */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-gold-400 border-b border-emerald-800 pb-2">
              ইভেন্ট সম্পর্কিত তথ্য
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-gold-500 mt-1 shrink-0" />
                <span>১২ ডিসেম্বর ২০২৬, শনিবার (সকাল ১০:০০টা হতে)</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold-500 mt-1 shrink-0" />
                <span>হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gold-400">শুভেচ্ছা ফি:</span>
                <span>১,০০০ টাকা (জনপ্রতি)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-gold-400 border-b border-emerald-800 pb-2">
              যোগাযোগ ও নীতিমালা
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="font-medium text-white">কাজী একেএম সাইফুদ্দিন মামুন</p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+8801819173608" className="hover:text-gold-400 transition-colors">
                  +880 1819-173608 (বিকাশ ও কল)
                </a>
              </div>
              <div className="pt-3 flex flex-wrap gap-4 text-xs">
                <Link to="/privacy" className="text-slate-400 hover:text-gold-400 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>গোপনীয়তা নীতি</span>
                </Link>
                <Link to="/contact" className="text-slate-400 hover:text-gold-400">
                  যোগাযোগ পাতা
                </Link>
                <Link to="/admin/login" className="text-slate-500 hover:text-slate-300">
                  অ্যাডমিন লগইন
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© ২০২৬ আল উয়ূন পরিষদ। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            ভালোবাসা ও আন্তরিকতায় নির্মিত — মিলনমেলা ২০২৬
          </p>
        </div>
      </div>
    </footer>
  );
}

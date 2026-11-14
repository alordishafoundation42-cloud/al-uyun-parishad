import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    eventName: 'আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)',
    eventDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
    eventVenue: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম',
    perPersonFee: 1000,
    contactPerson: 'কাজী একেএম সাইফুদ্দিন মামুন',
    contactMobile: '+880 1819-173608',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.warn('Using default settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/quiz/settings', settings);
      setMessage('ওয়েবসাইট তথ্য ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">ওয়েবসাইট সেটিংস</h1>
        <p className="text-xs text-slate-500">ইভেন্টের মূল তথ্য, ফি ও যোগাযোগের বিবরণ পরিচালনা</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-900 text-xs font-semibold flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          <div>
            <label className="font-bold text-slate-800 block mb-1">ইভেন্টের পূর্ণ নাম</label>
            <input
              type="text"
              value={settings.eventName}
              onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
              className="input input-bordered input-sm w-full text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">তারিখ ও বার</label>
              <input
                type="text"
                value={settings.eventDate}
                onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                className="input input-bordered input-sm w-full"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">শুভেচ্ছা ফি (প্রতি অংশগ্রহণকারী)</label>
              <input
                type="number"
                value={settings.perPersonFee}
                onChange={(e) => setSettings({ ...settings, perPersonFee: Number(e.target.value) })}
                className="input input-bordered input-sm w-full font-mono font-bold text-emerald-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">মিলনমেলা ভেন্যু / স্থান</label>
            <input
              type="text"
              value={settings.eventVenue}
              onChange={(e) => setSettings({ ...settings, eventVenue: e.target.value })}
              className="input input-bordered input-sm w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <label className="font-bold text-slate-800 block mb-1">দায়িত্বপ্রাপ্ত সমন্বয়কারী</label>
              <input
                type="text"
                value={settings.contactPerson}
                onChange={(e) => setSettings({ ...settings, contactPerson: e.target.value })}
                className="input input-bordered input-sm w-full"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">মোবাইল ও বিকাশ নম্বর</label>
              <input
                type="text"
                value={settings.contactMobile}
                onChange={(e) => setSettings({ ...settings, contactMobile: e.target.value })}
                className="input input-bordered input-sm w-full font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn btn-sm btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6"
            >
              <Save className="w-4 h-4 mr-1.5" /> সেটিংস সংরক্ষণ করুন
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

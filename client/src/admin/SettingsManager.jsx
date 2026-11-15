import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ListPlus, Trash2, Plus, Sliders } from 'lucide-react';
import api from '../services/api';

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'formOptions'
  const [settings, setSettings] = useState({
    eventName: 'আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)',
    eventDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
    eventVenue: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম',
    perPersonFee: 1000,
    contactPerson: 'কাজী একেএম সাইফুদ্দিন মামুন',
    contactMobile: '+880 1819-173608',
    formOptions: {
      relationships: ['স্ত্রী', 'ছেলে', 'মেয়ে', 'অন্যান্য'],
      degrees: ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', 'স্নাতক', 'স্নাতকোত্তর', 'এমফিল', 'পিএইচডি', 'অন্যান্য'],
      kamilSubjects: ['আদব', 'ফিকহ', 'তাফসির', 'হাদিস'],
      paymentMethods: ['বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক ট্রান্সফার']
    }
  });

  // Inputs for adding new options
  const [newRelationship, setNewRelationship] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newKamilSubject, setNewKamilSubject] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setSettings(prev => ({
            ...prev,
            ...data,
            formOptions: {
              relationships: data.formOptions?.relationships || prev.formOptions.relationships,
              degrees: data.formOptions?.degrees || prev.formOptions.degrees,
              kamilSubjects: data.formOptions?.kamilSubjects || prev.formOptions.kamilSubjects,
              paymentMethods: data.formOptions?.paymentMethods || prev.formOptions.paymentMethods,
            }
          }));
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
    if (e) e.preventDefault();
    try {
      await api.put('/admin/quiz/settings', settings);
      // Also cache in localStorage for instant front-end sync
      localStorage.setItem('aluyun_form_options', JSON.stringify(settings.formOptions));
      setMessage('ওয়েবসাইট তথ্য ও ফর্ম সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  // Add Item to a category
  const handleAddOption = (category, value, clearFn) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (settings.formOptions[category]?.includes(trimmed)) {
      alert('এই অপশনটি ইতিমধ্যে তালিকায় রয়েছে।');
      return;
    }
    setSettings(prev => ({
      ...prev,
      formOptions: {
        ...prev.formOptions,
        [category]: [...(prev.formOptions[category] || []), trimmed]
      }
    }));
    clearFn('');
  };

  // Remove Item from a category
  const handleRemoveOption = (category, item) => {
    setSettings(prev => ({
      ...prev,
      formOptions: {
        ...prev.formOptions,
        [category]: prev.formOptions[category].filter(opt => opt !== item)
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ওয়েবসাইট ও ফর্ম সেটিংস</h1>
          <p className="text-xs text-slate-500">ইভেন্টের মূল তথ্য, ফি এবং রেজিস্ট্রেশন ফর্মের ড্রপডাউন অপশন নিয়ন্ত্রণ</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-900 text-xs font-semibold flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center ${
            activeTab === 'general'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 mr-1.5" /> সাধারণ তথ্য ও ফি
        </button>
        <button
          onClick={() => setActiveTab('formOptions')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center ${
            activeTab === 'formOptions'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5 mr-1.5" /> রেজিস্ট্রেশন ফর্ম অপশন ম্যানেজমেন্ট
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
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
      )}

      {/* TAB 2: REGISTRATION FORM OPTIONS MANAGEMENT */}
      {activeTab === 'formOptions' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950">
            <span className="font-bold block mb-1">💡 রেজিস্ট্রেশন ফর্মের ড্রপডাউন বিকল্প কাস্টমাইজেশন:</span>
            এখানে আপনি রেজিস্ট্রেশন ফর্মের বিভিন্ন ড্রপডাউনে যা যা অপশন প্রদর্শিত হবে তা নিজের ইচ্ছামতো নতুন যুক্ত করতে পারবেন এবং অপ্রয়োজনীয় অপশন মুছে ফেলতে পারবেন। পরিবর্তনের পর নিচে <strong>"পরিবর্তনসমূহ সংরক্ষণ করুন"</strong> বাটনে চাপুন।
          </div>

          {/* 1. Relationships */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">১. পরিবারের সদস্যের সম্পর্কের বিকল্প (Family Relationships)</h3>
                <p className="text-[11px] text-slate-500">রেজিস্ট্রেশন ফর্মে পারিবারিক সদস্য যোগ করার সময় প্রদর্শিত হয়</p>
              </div>
              <span className="badge badge-sm badge-outline text-emerald-800">
                {settings.formOptions.relationships.length}টি অপশন
              </span>
            </div>

            {/* List of current options */}
            <div className="flex flex-wrap gap-2 pt-1">
              {settings.formOptions.relationships.map((rel) => (
                <div
                  key={rel}
                  className="inline-flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{rel}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption('relationships', rel)}
                    className="ml-2 text-slate-400 hover:text-red-600 transition-colors"
                    title={`"${rel}" অপশনটি মুছে ফেলুন`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new relationship */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newRelationship}
                onChange={(e) => setNewRelationship(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption('relationships', newRelationship, setNewRelationship);
                  }
                }}
                placeholder="নতুন সম্পর্কের নাম (যেমন: ভাই, বোন, পিতা, ইত্যাদি)..."
                className="input input-bordered input-sm flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddOption('relationships', newRelationship, setNewRelationship)}
                className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1" /> যুক্ত করুন
              </button>
            </div>
          </div>

          {/* 2. Educational Degrees */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">২. সর্বোচ্চ শিক্ষাগত যোগ্যতার বিকল্প (Degrees)</h3>
                <p className="text-[11px] text-slate-500">মূল রেজিস্ট্রেশন ফর্মে বন্ধুর শিক্ষাগত যোগ্যতা ড্রপডাউন</p>
              </div>
              <span className="badge badge-sm badge-outline text-emerald-800">
                {settings.formOptions.degrees.length}টি অপশন
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.formOptions.degrees.map((deg) => (
                <div
                  key={deg}
                  className="inline-flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{deg}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption('degrees', deg)}
                    className="ml-2 text-slate-400 hover:text-red-600 transition-colors"
                    title={`"${deg}" অপশনটি মুছে ফেলুন`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption('degrees', newDegree, setNewDegree);
                  }
                }}
                placeholder="নতুন ডিগ্রি বা শিক্ষাগত যোগ্যতা (যেমন: ডিপ্লোমা)..."
                className="input input-bordered input-sm flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddOption('degrees', newDegree, setNewDegree)}
                className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1" /> যুক্ত করুন
              </button>
            </div>
          </div>

          {/* 3. Kamil Subjects */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">৩. কামিলের বিষয়সমূহ (Kamil Subjects)</h3>
                <p className="text-[11px] text-slate-500">শিক্ষাগত যোগ্যতা 'কামিল' হলে এই বিষয়গুলো ড্রপডাউনে প্রদর্শিত হয়</p>
              </div>
              <span className="badge badge-sm badge-outline text-emerald-800">
                {settings.formOptions.kamilSubjects.length}টি বিষয়
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.formOptions.kamilSubjects.map((sub) => (
                <div
                  key={sub}
                  className="inline-flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption('kamilSubjects', sub)}
                    className="ml-2 text-slate-400 hover:text-red-600 transition-colors"
                    title={`"${sub}" মুছে ফেলুন`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newKamilSubject}
                onChange={(e) => setNewKamilSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption('kamilSubjects', newKamilSubject, setNewKamilSubject);
                  }
                }}
                placeholder="কামিলের নতুন বিষয়..."
                className="input input-bordered input-sm flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddOption('kamilSubjects', newKamilSubject, setNewKamilSubject)}
                className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1" /> যুক্ত করুন
              </button>
            </div>
          </div>

          {/* 4. Payment Methods */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">৪. পেমেন্ট মাধ্যমসমূহ (Payment Methods)</h3>
                <p className="text-[11px] text-slate-500">রেজিস্ট্রেশন ফি পরিশোধের অপশন</p>
              </div>
              <span className="badge badge-sm badge-outline text-emerald-800">
                {settings.formOptions.paymentMethods.length}টি মাধ্যম
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.formOptions.paymentMethods.map((pm) => (
                <div
                  key={pm}
                  className="inline-flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{pm}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption('paymentMethods', pm)}
                    className="ml-2 text-slate-400 hover:text-red-600 transition-colors"
                    title={`"${pm}" মুছে ফেলুন`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption('paymentMethods', newPaymentMethod, setNewPaymentMethod);
                  }
                }}
                placeholder="নতুন পেমেন্ট মাধ্যম (যেমন: সেলফিন, ক্যাশ)..."
                className="input input-bordered input-sm flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddOption('paymentMethods', newPaymentMethod, setNewPaymentMethod)}
                className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1" /> যুক্ত করুন
              </button>
            </div>
          </div>

          {/* Sticky/Bottom Save button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" /> ফর্মের সকল অপশন সংরক্ষণ করুন
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

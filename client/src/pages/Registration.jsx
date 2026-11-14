import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Building2
} from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();

  // Friend details
  const [formData, setFormData] = useState({
    friendName: '',
    mobile: '',
    email: '',
    profession: '',
    highestDegree: '',
    kamilSubject: '',
    presentAddress: '',
    permanentAddress: '',
    paymentMethod: 'বিকাশ',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    senderMobile: '',
    receiptUrl: '',
  });

  // Dynamic family members
  const [familyMembers, setFamilyMembers] = useState([]);

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle standard field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset kamilSubject if degree changed from কামিল to something else
      ...(name === 'highestDegree' && value !== 'কামিল' ? { kamilSubject: '' } : {})
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Add a new family member
  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        age: '',
        gender: 'মহিলা',
        relationship: 'স্ত্রী',
      }
    ]);
  };

  // Remove a family member
  const removeFamilyMember = (id) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Update a family member field
  const updateFamilyMember = (id, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Participant counts & calculation
  const friendCount = 1;
  const familyCount = familyMembers.length;
  const totalParticipants = friendCount + familyCount;
  const perPersonFee = 1000;
  const totalPayableFee = totalParticipants * perPersonFee;

  // Bengali number conversion
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.friendName.trim()) newErrors.friendName = 'বন্ধুর পূর্ণ নাম লিখুন';
    if (!formData.mobile.trim()) {
      newErrors.mobile = '১১ ডিজিটের মোবাইল নম্বর লিখুন';
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'সঠিক বাংলাদেশী মোবাইল নম্বর প্রদান করুন (যেমন: 01819173608)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল ঠিকানা লিখুন';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন';
    }

    if (!formData.profession.trim()) newErrors.profession = 'পেশা উল্লেখ করুন';
    if (!formData.highestDegree) newErrors.highestDegree = 'সর্বোচ্চ শিক্ষাগত যোগ্যতা নির্বাচন করুন';
    if (formData.highestDegree === 'কামিল' && !formData.kamilSubject) {
      newErrors.kamilSubject = 'কামিলের বিষয় নির্বাচন করুন';
    }

    if (!formData.presentAddress.trim()) newErrors.presentAddress = 'বর্তমান ঠিকানা লিখুন';
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = 'স্থায়ী/গ্রামের ঠিকানা লিখুন';

    // Payment validation
    if (!formData.transactionId.trim()) newErrors.transactionId = 'ট্রানজ্যাকশন আইডি বা ব্যাংক রেফারেন্স দিন';
    if (!formData.senderMobile.trim()) newErrors.senderMobile = 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন';
    if (!formData.paymentDate) newErrors.paymentDate = 'পেমেন্টের তারিখ নির্বাচন করুন';

    // Family members validation
    familyMembers.forEach((member, idx) => {
      if (!member.name.trim()) {
        newErrors[`family_${member.id}_name`] = `সদস্য #${idx + 1}-এর নাম লিখুন`;
      }
      if (!member.age || member.age <= 0) {
        newErrors[`family_${member.id}_age`] = `সদস্য #${idx + 1}-এর সঠিক বয়স লিখুন`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean mobile number
      const cleanMobile = formData.mobile.replace(/\D/g, '');

      const payload = {
        friendName: formData.friendName.trim(),
        mobile: cleanMobile,
        email: formData.email.trim(),
        profession: formData.profession.trim(),
        highestDegree: formData.highestDegree,
        kamilSubject: formData.highestDegree === 'কামিল' ? formData.kamilSubject : null,
        presentAddress: formData.presentAddress.trim(),
        permanentAddress: formData.permanentAddress.trim(),
        familyMembers: familyMembers.map(({ name, age, gender, relationship }) => ({
          name: name.trim(),
          age: Number(age),
          gender,
          relationship,
        })),
        participantCount: totalParticipants,
        totalFee: totalPayableFee,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId.trim(),
        paymentDate: formData.paymentDate,
        senderMobile: formData.senderMobile.trim(),
        receiptUrl: formData.receiptUrl || null,
      };

      // Call API or use placeholder generator for UI testing
      let registrationNumber = 'AUP-2026-' + Math.floor(1000 + Math.random() * 9000);
      try {
        const response = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok && data.data?.registrationNumber) {
          registrationNumber = data.data.registrationNumber;
        } else if (response.status === 409) {
          throw new Error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে। সংশোধনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।');
        }
      } catch (apiErr) {
        if (apiErr.message.includes('ইতিমধ্যে রেজিস্ট্রেশন')) {
          throw apiErr;
        }
        // Fallback for phase 3 offline UI test
        console.warn('Backend not connected yet in Phase 3, saving to session:', apiErr);
      }

      // Navigate to success page with registration details
      navigate('/registration-success', {
        state: {
          registrationNumber,
          friendName: formData.friendName,
          participantCount: totalParticipants,
          totalFee: totalPayableFee,
          mobile: cleanMobile,
        }
      });

    } catch (err) {
      setSubmitError(err.message || 'রেজিস্ট্রেশন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block text-gold-600 font-serif text-lg tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            পারিবারিক রেজিস্ট্রেশন ফরম
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)। দয়া করে আপনার ও পরিবারের সদস্যদের সঠিক তথ্য দিন।
          </p>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-start space-x-3 text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{submitError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION A: REGISTERED FRIEND INFORMATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
            <div className="border-b border-emerald-100 pb-3 flex items-center space-x-2 text-emerald-900">
              <User className="w-6 h-6 text-gold-600" />
              <h2 className="text-xl font-bold">ক. মূল নিবন্ধিত বন্ধুর তথ্য</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  পূর্ণ নাম <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="friendName"
                  value={formData.friendName}
                  onChange={handleInputChange}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.friendName ? 'input-error' : ''}`}
                />
                {errors.friendName && <p className="text-xs text-red-500 mt-1">{errors.friendName}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  মোবাইল নম্বর (১১ ডিজিট) <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="01819173608"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white font-mono ${errors.mobile ? 'input-error' : ''}`}
                />
                <span className="text-xs text-slate-400">এই নম্বরেই কুইজের সময় ভেরিফিকেশন করা হবে</span>
                {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  ইমেইল ঠিকানা <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@mail.com"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.email ? 'input-error' : ''}`}
                />
                <span className="text-xs text-slate-400">পেমেন্ট নিশ্চিতকরণ ও ফলাফল এই ঠিকানায় যাবে</span>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Profession */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  পেশা <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  placeholder="যেমন: শিক্ষকতা, ব্যবসা, চাকরি..."
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.profession ? 'input-error' : ''}`}
                />
                {errors.profession && <p className="text-xs text-red-500 mt-1">{errors.profession}</p>}
              </div>

              {/* Highest Educational Degree */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  সর্বোচ্চ শিক্ষাগত যোগ্যতা <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="highestDegree"
                  value={formData.highestDegree}
                  onChange={handleInputChange}
                  className={`select select-bordered w-full bg-slate-50 focus:bg-white ${errors.highestDegree ? 'select-error' : ''}`}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="দাখিল">দাখিল</option>
                  <option value="আলিম">আলিম</option>
                  <option value="ফাজিল">ফাজিল</option>
                  <option value="কামিল">কামিল</option>
                  <option value="স্নাতক">স্নাতক</option>
                  <option value="স্নাতকোত্তর">স্নাতকোত্তর</option>
                  <option value="এমফিল">এমফিল</option>
                  <option value="পিএইচডি">পিএইচডি</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
                {errors.highestDegree && <p className="text-xs text-red-500 mt-1">{errors.highestDegree}</p>}
              </div>

              {/* Conditional Kamil Subject Dropdown */}
              {formData.highestDegree === 'কামিল' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-sm font-semibold text-emerald-900 flex items-center">
                    কামিলের বিষয় <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="kamilSubject"
                    value={formData.kamilSubject}
                    onChange={handleInputChange}
                    className={`select select-bordered select-primary w-full bg-slate-50 focus:bg-white ${errors.kamilSubject ? 'select-error' : ''}`}
                  >
                    <option value="">বিষয় নির্বাচন করুন</option>
                    <option value="আদব">আদব</option>
                    <option value="ফিকহ">ফিকহ</option>
                    <option value="তাফসির">তাফসির</option>
                    <option value="হাদিস">হাদিস</option>
                  </select>
                  {errors.kamilSubject && <p className="text-xs text-red-500 mt-1">{errors.kamilSubject}</p>}
                </div>
              )}

              {/* Present Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  বর্তমান ঠিকানা <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleInputChange}
                  placeholder="বাসা/রোড, এলাকা, উপজেলা/থানা, জেলা"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.presentAddress ? 'input-error' : ''}`}
                />
                {errors.presentAddress && <p className="text-xs text-red-500 mt-1">{errors.presentAddress}</p>}
              </div>

              {/* Permanent Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center">
                  স্থায়ী/গ্রামের ঠিকানা <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.permanentAddress ? 'input-error' : ''}`}
                />
                {errors.permanentAddress && <p className="text-xs text-red-500 mt-1">{errors.permanentAddress}</p>}
              </div>

            </div>
          </div>

          {/* SECTION B: DYNAMIC FAMILY MEMBERS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
            <div className="border-b border-emerald-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 text-emerald-900">
                <Users className="w-6 h-6 text-gold-600" />
                <div>
                  <h2 className="text-xl font-bold">খ. পরিবারের অন্যান্য অংশগ্রহণকারী সদস্য</h2>
                  <p className="text-xs text-slate-500">আপনার সাথে যে সকল সদস্য মিলনমেলায় আসবেন তাদের যুক্ত করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFamilyMember}
                className="btn btn-sm btn-outline border-emerald-700 text-emerald-800 hover:bg-emerald-800 hover:text-white shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" /> সদস্য যোগ করুন
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">
                  পরিবারের কোনো সদস্য যোগ করা হয়নি। আপনি একা অংশগ্রহণ করলে সরাসরি পেমেন্ট তথ্য পূরণ করুন।
                </p>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white mt-3"
                >
                  <Plus className="w-4 h-4 mr-1" /> পরিবার/সন্তান যোগ করুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 relative group space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        পারিবারিক সদস্য #{toBangla(index + 1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(member.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors flex items-center text-xs"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> মুছে ফেলুন
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Member Name */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-700">নাম *</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                          placeholder="সদস্যের নাম"
                          className="input input-bordered input-sm w-full bg-white"
                        />
                        {errors[`family_${member.id}_name`] && (
                          <p className="text-[11px] text-red-500">{errors[`family_${member.id}_name`]}</p>
                        )}
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">বয়স (বছর) *</label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                          placeholder="বয়স"
                          className="input input-bordered input-sm w-full bg-white"
                        />
                        {errors[`family_${member.id}_age`] && (
                          <p className="text-[11px] text-red-500">{errors[`family_${member.id}_age`]}</p>
                        )}
                      </div>

                      {/* Relationship */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">সম্পর্ক *</label>
                        <select
                          value={member.relationship}
                          onChange={(e) => updateFamilyMember(member.id, 'relationship', e.target.value)}
                          className="select select-bordered select-sm w-full bg-white"
                        >
                          <option value="স্ত্রী">স্ত্রী</option>
                          <option value="ছেলে">ছেলে</option>
                          <option value="মেয়ে">মেয়ে</option>
                          <option value="অন্যান্য">অন্যান্য</option>
                        </select>
                      </div>

                      {/* Gender */}
                      <div className="sm:col-span-4 flex items-center space-x-6 pt-1 text-xs text-slate-700">
                        <span className="font-semibold">লিঙ্গ:</span>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender_${member.id}`}
                            checked={member.gender === 'পুরুষ'}
                            onChange={() => updateFamilyMember(member.id, 'gender', 'পুরুষ')}
                            className="radio radio-xs radio-primary"
                          />
                          <span>পুরুষ</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender_${member.id}`}
                            checked={member.gender === 'মহিলা'}
                            onChange={() => updateFamilyMember(member.id, 'gender', 'মহিলা')}
                            className="radio radio-xs radio-primary"
                          />
                          <span>মহিলা</span>
                        </label>
                      </div>

                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="btn btn-sm btn-outline border-emerald-700 text-emerald-800 hover:bg-emerald-800 hover:text-white w-full py-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> আরও সদস্য যোগ করুন
                </button>
              </div>
            )}
          </div>

          {/* SECTION C: AUTOMATIC FEE CALCULATION BREAKDOWN */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/50 space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <h3 className="text-xl font-bold text-gold-400">
                গ. শুভেচ্ছা ফি হিসাব বিবরণী
              </h3>
              <span className="text-xs bg-gold-500/20 text-gold-300 border border-gold-500/40 px-3 py-1 rounded-full font-semibold">
                স্বয়ংক্রিয় গণনা
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800">
                <span className="text-xs text-emerald-200">মূল বন্ধু</span>
                <div className="text-xl font-bold text-white mt-1">১ জন</div>
              </div>
              <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800">
                <span className="text-xs text-emerald-200">পরিবারের সদস্য</span>
                <div className="text-xl font-bold text-white mt-1">{toBangla(familyCount)} জন</div>
              </div>
              <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800">
                <span className="text-xs text-emerald-200">মোট অংশগ্রহণকারী</span>
                <div className="text-xl font-bold text-gold-400 mt-1">{toBangla(totalParticipants)} জন</div>
              </div>
              <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800">
                <span className="text-xs text-emerald-200">জনপ্রতি ফি</span>
                <div className="text-xl font-bold text-white mt-1">১,০০০ ৳</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-800/50 rounded-2xl border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-sm text-emerald-100">সর্বমোট প্রদেয় শুভেচ্ছা ফি:</span>
                <div className="text-xs text-emerald-300">({toBangla(totalParticipants)} জন × ১,০০০ টাকা)</div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-gold-400 font-mono">
                {toBangla(totalPayableFee)} টাকা
              </div>
            </div>
          </div>

          {/* SECTION D: PAYMENT INFORMATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
            <div className="border-b border-emerald-100 pb-3 flex items-center space-x-2 text-emerald-900">
              <CreditCard className="w-6 h-6 text-gold-600" />
              <h2 className="text-xl font-bold">ঘ. শুভেচ্ছা ফি জমাদানের তথ্য</h2>
            </div>

            {/* Payment Options Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: bKash */}
              <div className={`p-5 rounded-2xl border transition-all ${
                formData.paymentMethod === 'বিকাশ' 
                  ? 'bg-pink-50/70 border-pink-300 ring-2 ring-pink-600/20' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-pink-200/50">
                  <span className="text-xs font-bold text-pink-800 uppercase tracking-wider">পদ্ধতি ১ : বিকাশ (পার্সোনাল)</span>
                  <span className="badge badge-sm bg-pink-700 text-white border-none">Send Money</span>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="text-xs text-slate-500">প্রাপক: কাজী একেএম সাইফুদ্দিন মামুন</div>
                  <div className="text-xl font-extrabold text-pink-800 font-mono tracking-wider">+880 1819-173608</div>
                  <p className="text-xs text-slate-600 pt-1">
                    মোট <strong>{toBangla(totalPayableFee)} টাকা</strong> বিকাশ করে প্রাপ্ত TrxID দিন।
                  </p>
                </div>
              </div>

              {/* Option 2: Bank Deposit */}
              <div className={`p-5 rounded-2xl border transition-all ${
                formData.paymentMethod === 'ব্যাংক' 
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-600/20' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    পদ্ধতি ২ : ব্যাংক একাউন্ট
                  </span>
                  <span className="badge badge-sm bg-emerald-800 text-white border-none">AIBL</span>
                </div>
                <div className="pt-2 space-y-1 text-xs text-slate-700">
                  <div><strong>ব্যাংক:</strong> আল-আরাফাহ্ ইসলামী ব্যাংক লিমিটেড</div>
                  <div><strong>শাখা:</strong> মুরাদপুর শাখা, চট্টগ্রাম</div>
                  <div><strong>হিসাবের নাম:</strong> <span className="font-mono font-bold">ALYOUN PORISHAD</span></div>
                  <div><strong>হিসাব নং:</strong> <span className="font-mono font-extrabold text-emerald-900 text-sm">1091120017273</span></div>
                  <p className="text-xs text-slate-600 pt-0.5">
                    ব্যাংক ডিপোজিট বা ট্রান্সফার করে স্লিপ নং/রেফারেন্স দিন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">পেমেন্ট মাধ্যম সিলেক্ট করুন *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'বিকাশ' }))}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'বিকাশ'
                        ? 'bg-pink-700 text-white border-pink-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    বিকাশ (bKash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'ব্যাংক' }))}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'ব্যাংক'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ব্যাংক একাউন্ট
                  </button>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  ট্রানজ্যাকশন আইডি (TrxID) / ব্যাংক রেফারেন্স *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="যেমন: BL9X7K290 অথবা ডিপোজিট স্লিপ নং"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white font-mono ${errors.transactionId ? 'input-error' : ''}`}
                />
                {errors.transactionId && <p className="text-xs text-red-500 mt-1">{errors.transactionId}</p>}
              </div>

              {/* Sender Mobile */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  প্রেরক মোবাইল নম্বর (যে নম্বর থেকে পাঠিয়েছেন) *
                </label>
                <input
                  type="text"
                  name="senderMobile"
                  value={formData.senderMobile}
                  onChange={handleInputChange}
                  placeholder="018XXXXXXXX"
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white font-mono ${errors.senderMobile ? 'input-error' : ''}`}
                />
                {errors.senderMobile && <p className="text-xs text-red-500 mt-1">{errors.senderMobile}</p>}
              </div>

              {/* Payment Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">পেমেন্টের তারিখ *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.paymentDate ? 'input-error' : ''}`}
                />
                {errors.paymentDate && <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>}
              </div>

              {/* Optional Receipt note */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  পেমেন্ট রসিদ / স্ক্রিনশট লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="receiptUrl"
                  value={formData.receiptUrl}
                  onChange={handleInputChange}
                  placeholder="রসিদের ইমেজ ড্রাইভ বা ক্লাউড লিংক (প্রযোজ্য হলে)"
                  className="input input-bordered w-full bg-slate-50 focus:bg-white"
                />
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg px-12 py-3 h-auto shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all w-full sm:w-auto"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>রেজিস্ট্রেশন জমা দিন ({toBangla(totalPayableFee)} টাকা)</>
              )}
            </button>
            <p className="text-xs text-slate-500 mt-3">
              জমা দেওয়ার পর পেমেন্ট স্ট্যাটাস পেন্ডিং থাকবে। অ্যাডমিন কর্তৃক যাচাই সম্পন্ন হলে নিশ্চিতকরণ ইমেইল পাঠানো হবে।
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}

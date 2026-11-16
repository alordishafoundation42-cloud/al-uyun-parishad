import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { uploadToImgBB } from '../utils/imageUpload';
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
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Building2,
  Banknote,
  UploadCloud,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();

  // Dynamic Form Options (Loaded from Admin settings)
  const [formOptions, setFormOptions] = useState({
    relationships: ['স্ত্রী', 'ছেলে', 'মেয়ে', 'অন্যান্য'],
    degrees: ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', 'স্নাতক', 'স্নাতকোত্তর', 'এমফিল', 'পিএইচডি', 'অন্যান্য'],
    kamilSubjects: ['আদব', 'ফিকহ', 'তাফসির', 'হাদিস'],
    paymentMethods: ['বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক ট্রান্সফার']
  });

  useEffect(() => {
    // 1. Check local cached options
    try {
      const cached = localStorage.getItem('aluyun_form_options');
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormOptions(prev => ({
          relationships: parsed.relationships?.length ? parsed.relationships : prev.relationships,
          degrees: parsed.degrees?.length ? parsed.degrees : prev.degrees,
          kamilSubjects: parsed.kamilSubjects?.length ? parsed.kamilSubjects : prev.kamilSubjects,
          paymentMethods: parsed.paymentMethods?.length ? parsed.paymentMethods : prev.paymentMethods,
        }));
      }
    } catch {}

    // 2. Fetch fresh options from server
    api.get('/settings').then(res => {
      if (res.data?.success && res.data?.data?.formOptions) {
        const remote = res.data.data.formOptions;
        setFormOptions(prev => ({
          relationships: remote.relationships?.length ? remote.relationships : prev.relationships,
          degrees: remote.degrees?.length ? remote.degrees : prev.degrees,
          kamilSubjects: remote.kamilSubjects?.length ? remote.kamilSubjects : prev.kamilSubjects,
          paymentMethods: remote.paymentMethods?.length ? remote.paymentMethods : prev.paymentMethods,
        }));
      }
    }).catch(() => {});
  }, []);

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
    cashReceiver: '',
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
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Convert Bengali numerals to English numerals
  const toEnglishDigits = (str) => {
    if (!str && str !== 0) return '';
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(str).replace(/[০-৯]/g, (w) => banglaDigits.indexOf(w));
  };

  // Upload payment receipt / screenshot to ImgBB
  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    setUploadError('');
    try {
      const url = await uploadToImgBB(file);
      setFormData(prev => ({ ...prev, receiptUrl: url }));
      if (errors.receiptUrl) {
        setErrors(prev => ({ ...prev, receiptUrl: '' }));
      }
      if (errors.transactionId) {
        setErrors(prev => ({ ...prev, transactionId: '' }));
      }
    } catch (err) {
      setUploadError(err.message || 'ছবি আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setUploadingReceipt(false);
      e.target.value = '';
    }
  };

  const handleRemoveReceipt = () => {
    setFormData(prev => ({ ...prev, receiptUrl: '' }));
    setUploadError('');
  };

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

  // Update a family member field (allows direct number typing, supports English & Bengali digits)
  const updateFamilyMember = (id, field, value) => {
    let finalValue = value;
    if (field === 'age') {
      finalValue = toEnglishDigits(value).replace(/\D/g, '');
    }
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: finalValue } : m))
    );
    if (errors[`family_${id}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`family_${id}_${field}`]: '' }));
    }
  };

  // Participant counts & calculation
  // (৩ বছরের শিশুর জন্য কোনো ফি লাগবে না)
  const friendCount = 1;
  const familyCount = familyMembers.length;
  const totalParticipants = friendCount + familyCount;

  // 3 years or younger child fee exemption
  const freeChildrenCount = familyMembers.filter((m) => {
    const ageNum = Number(m.age);
    const isChild = ['ছেলে', 'মেয়ে', 'অন্যান্য'].includes(m.relationship) && m.relationship !== 'স্ত্রী';
    return isChild && ageNum >= 0 && ageNum <= 3;
  }).length;

  const payingParticipants = Math.max(1, totalParticipants - freeChildrenCount);
  const perPersonFee = 1000;
  const totalPayableFee = payingParticipants * perPersonFee;

  // Bengali number conversion
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  // Check payment method types
  const isCash = Boolean(
    formData.paymentMethod && (
      formData.paymentMethod.includes('হাতে') ||
      formData.paymentMethod.includes('ক্যাশ') ||
      formData.paymentMethod.toLowerCase().includes('cash')
    )
  );

  const isBank = Boolean(
    formData.paymentMethod && (
      formData.paymentMethod.includes('ব্যাংক') ||
      formData.paymentMethod.toLowerCase().includes('bank')
    )
  );

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
    if (isCash) {
      if (!formData.cashReceiver.trim()) {
        newErrors.cashReceiver = 'কার কাছে নগদ টাকা জমা দিয়েছেন তাঁর নাম ও পরিচয় উল্লেখ করুন';
      }
    } else if (isBank) {
      // ব্যাংক জমা: ডিপোজিট স্লিপের ছবি আবশ্যক
      if (!formData.receiptUrl) {
        newErrors.receiptUrl = 'ব্যাংক ডিপোজিট স্লিপের ছবি আপলোড করা আবশ্যক';
      }
    } else {
      // বিকাশ: রসিদ/স্ক্রিনশট দিলে TrxID লাগবে না, অথবা TrxID দিতে পারে
      const hasReceipt = Boolean(formData.receiptUrl);
      const hasTrx = Boolean(formData.transactionId && formData.transactionId.trim());

      if (!hasReceipt && !hasTrx) {
        newErrors.transactionId = 'বিকাশ TrxID দিন অথবা পেমেন্টের রসিদ/স্ক্রিনশটের ছবি আপলোড করুন';
      }
      if (!hasReceipt && !formData.senderMobile.trim()) {
        newErrors.senderMobile = 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন';
      }
    }
    if (!formData.paymentDate) newErrors.paymentDate = 'পেমেন্টের তারিখ নির্বাচন করুন';

    // Family members validation (বয়স সংখ্যায় টাইপ আবশ্যক)
    familyMembers.forEach((member, idx) => {
      if (!member.name.trim()) {
        newErrors[`family_${member.id}_name`] = `সদস্য #${idx + 1}-এর নাম লিখুন`;
      }
      if (member.age === '' || member.age === undefined || isNaN(Number(member.age)) || Number(member.age) < 0) {
        newErrors[`family_${member.id}_age`] = `সদস্য #${idx + 1}-এর সঠিক বয়স সংখ্যায় টাইপ করুন`;
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
        cashReceiver: formData.cashReceiver ? formData.cashReceiver.trim() : '',
        transactionId: formData.transactionId ? formData.transactionId.trim() : '',
        paymentDate: formData.paymentDate,
        senderMobile: formData.senderMobile ? formData.senderMobile.trim() : '',
        receiptUrl: formData.receiptUrl || null,
      };

      // Submit to backend API
      let registrationNumber = '';
      try {
        const res = await api.post('/registrations', payload);
        if (res.data?.success && res.data?.data?.registrationNumber) {
          registrationNumber = res.data.data.registrationNumber;
        } else {
          throw new Error(res.data?.message || 'সার্ভার থেকে রেজিস্ট্রেশন নিশ্চিতকরণ পাওয়া যায়নি।');
        }
      } catch (apiErr) {
        const errorMsg = apiErr.response?.data?.message || apiErr.message || 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
        throw new Error(errorMsg);
      }

      // Navigate to success page ONLY on genuine server confirmation
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
                  {formOptions.degrees.map((deg) => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
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
                    {formOptions.kamilSubjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
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
                        <label className="text-xs font-semibold text-slate-700">বয়স (সংখ্যায় টাইপ করুন) *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                          placeholder="বয়স (যেমন: ৫)"
                          className={`input input-bordered input-sm w-full bg-white font-mono ${errors[`family_${member.id}_age`] ? 'input-error' : ''}`}
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
                          {formOptions.relationships.map((rel) => (
                            <option key={rel} value={rel}>{rel}</option>
                          ))}
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
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-sm text-emerald-100 font-semibold">সর্বমোট প্রদেয় শুভেচ্ছা ফি:</span>
                <div className="text-xs text-emerald-300">
                  ({toBangla(payingParticipants)} জন × ১,০০০ টাকা)
                  {freeChildrenCount > 0 && (
                    <span className="text-amber-300 ml-2 font-medium">
                      * ৩ বছর বা কম বয়সী {toBangla(freeChildrenCount)} শিশুর ফি ফ্রি
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gold-300/90 pt-0.5">
                  (৩ বছরের শিশুর জন্য কোনো ফি লাগবে না)
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: bKash */}
              <div 
                onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'বিকাশ' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'বিকাশ' 
                    ? 'bg-pink-50/80 border-pink-400 ring-2 ring-pink-600/30 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-pink-200/50">
                  <span className="text-xs font-bold text-pink-800 uppercase tracking-wider">পদ্ধতি ১ : বিকাশ</span>
                  <span className="badge badge-xs bg-pink-700 text-white border-none">Send Money</span>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="text-[11px] text-slate-500">প্রাপক: কাজী একেএম সাইফুদ্দিন মামুন</div>
                  <div className="text-lg font-extrabold text-pink-800 font-mono tracking-wider">+880 1819-173608</div>
                  <p className="text-[11px] text-slate-600 pt-0.5">
                    মোট <strong>{toBangla(totalPayableFee)} ৳</strong> বিকাশ করে TrxID দিন।
                  </p>
                </div>
              </div>

              {/* Option 2: Bank Deposit */}
              <div 
                onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'ব্যাংক' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'ব্যাংক' 
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-600/30 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    পদ্ধতি ২ : ব্যাংক
                  </span>
                  <span className="badge badge-xs bg-emerald-800 text-white border-none">AIBL</span>
                </div>
                <div className="pt-2 space-y-0.5 text-[11px] text-slate-700">
                  <div><strong>আল-আরাফাহ্ ইসলামী ব্যাংক</strong></div>
                  <div>মুরাদপুর শাখা | হিসাব: <span className="font-mono font-bold">ALYOUN PORISHAD</span></div>
                  <div>হিসাব নং: <span className="font-mono font-extrabold text-emerald-900 text-xs">1091120017273</span></div>
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    ডিপোজিট করে স্লিপ নং/রেফারেন্স দিন।
                  </p>
                </div>
              </div>

              {/* Option 3: Hand Cash */}
              <div 
                onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'হাতে হাতে / ক্যাশ' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isCash 
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-600/30 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
                    <Banknote className="w-3.5 h-3.5 mr-1 text-amber-700" />
                    পদ্ধতি ৩ : হাতে হাতে ক্যাশ
                  </span>
                  <span className="badge badge-xs bg-amber-700 text-white border-none">Cash</span>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="text-[11px] text-slate-600">সরাসরি ক্যাশ প্রদান</div>
                  <div className="text-sm font-bold text-amber-900">সমন্বয়ক বা বন্ধুর নিকট</div>
                  <p className="text-[11px] text-slate-600 pt-0.5">
                    কার হাতে নগদ ফি জমা দিয়েছেন তাঁর নাম নিচে উল্লেখ করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Payment Method Selector */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">পেমেন্ট মাধ্যম নির্বাচন করুন *</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'বিকাশ' }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
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
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'ব্যাংক'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ব্যাংক একাউন্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'হাতে হাতে / ক্যাশ' }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                      isCash
                        ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    হাতে হাতে / ক্যাশ
                  </button>
                </div>
              </div>

              {/* Conditional Fields based on Payment Method */}
              {isCash ? (
                <>
                  {/* Cash Receiver Name */}
                  <div className="sm:col-span-2 space-y-1.5 p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl">
                    <label className="text-sm font-bold text-amber-950 flex items-center">
                      <Banknote className="w-4 h-4 mr-1.5 text-amber-700" />
                      কার কাছে নগদ টাকা জমা দিয়েছেন? *
                    </label>
                    <input
                      type="text"
                      name="cashReceiver"
                      value={formData.cashReceiver}
                      onChange={handleInputChange}
                      placeholder="যেমন: কাজী একেএম সাইফুদ্দিন মামুন ভাই / দায়িত্বশীল বন্ধুর নাম"
                      className={`input input-bordered w-full bg-white focus:bg-white text-sm ${errors.cashReceiver ? 'input-error' : ''}`}
                    />
                    {errors.cashReceiver && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.cashReceiver}</p>
                    )}
                    <p className="text-xs text-amber-800 mt-1">
                      💡 আপনি যার কাছে নগদ টাকা হস্তান্তর করেছেন, তাঁর নাম ও পরিচয় এখানে লিখুন যাতে যাচাই কমিটি দ্রুত নিশ্চিত করতে পারে।
                    </p>
                  </div>

                  {/* Payment Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">নগদ টাকা জমাদানের তারিখ *</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.paymentDate ? 'input-error' : ''}`}
                    />
                    {errors.paymentDate && <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>}
                  </div>

                  {/* Cash Receipt / Reference (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">
                      রশিদ নম্বর / মন্তব্য (যদি থাকে)
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="ক্যাশ মানি রসিদ নম্বর বা নোট (ঐচ্ছিক)"
                      className="input input-bordered w-full bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                </>
              ) : isBank ? (
                <>
                  {/* Bank Deposit Fields: No TrxID or sender mobile required, Slip image is required! */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">ব্যাংকে টাকা জমাদানের তারিখ *</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.paymentDate ? 'input-error' : ''}`}
                    />
                    {errors.paymentDate && <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>}
                  </div>

                  {/* Slip No / Reference (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">
                      ডিপোজিট স্লিপ নম্বর / রেফারেন্স (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="ব্যাংক স্লিপ নং বা রেফারেন্স (যদি থাকে)"
                      className="input input-bordered w-full bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* bKash Fields */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">
                      বিকাশ ট্রানজ্যাকশন আইডি (TrxID)
                      {formData.receiptUrl ? ' (ঐচ্ছিক - ছবি দেওয়া হয়েছে)' : ' *'}
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="যেমন: BL9X7K290 (স্ক্রিনশট আপলোড করলে TrxID ঐচ্ছিক)"
                      className={`input input-bordered w-full bg-slate-50 focus:bg-white font-mono ${errors.transactionId ? 'input-error' : ''}`}
                    />
                    {errors.transactionId && <p className="text-xs text-red-500 mt-1">{errors.transactionId}</p>}
                  </div>

                  {/* Sender Mobile */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">
                      প্রেরক বিকাশ নম্বর
                      {formData.receiptUrl ? ' (ঐচ্ছিক)' : ' *'}
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
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">বিকাশ পেমেন্টের তারিখ *</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.paymentDate ? 'input-error' : ''}`}
                    />
                    {errors.paymentDate && <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>}
                  </div>
                </>
              )}

              {/* Receipt / Screenshot Image Upload with ImgBB */}
              <div className="sm:col-span-2 space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    {isBank 
                      ? 'ব্যাংক ডিপোজিট স্লিপের ছবি আপলোড করুন *' 
                      : 'পেমেন্ট রসিদ / স্ক্রিনশটের ছবি আপলোড (ঐচ্ছিক)'}
                  </label>
                  {isBank ? (
                    <span className="badge badge-sm badge-error text-white font-bold">বাধ্যতামূলক</span>
                  ) : (
                    <span className="badge badge-sm badge-ghost text-slate-600 font-semibold">ছবি দিলে TrxID লাগবে না</span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  {isBank 
                    ? 'ব্যাংক থেকে প্রাপ্ত সিলযুক্ত ডিপোজিট স্লিপের স্পষ্ট ছবি তুলে এখানে আপলোড করুন।'
                    : 'বিকাশ অ্যাপের পেমেন্ট সম্পন্ন হওয়ার স্ক্রিনশট বা রসিদের ছবি আপলোড করতে পারেন। ছবি দিলে TrxID টাইপ করার প্রয়োজন নেই।'}
                </p>

                {formData.receiptUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-300">
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.receiptUrl}
                        alt="Payment Receipt"
                        className="w-16 h-16 object-cover rounded-lg border border-emerald-400 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> রসিদের ছবি সফলভাবে আপলোড হয়েছে
                        </div>
                        <a
                          href={formData.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 underline flex items-center gap-0.5 mt-0.5 hover:text-emerald-900"
                        >
                          ছবিটি সম্পূর্ণ আকারে দেখুন <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      className="btn btn-xs btn-outline border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> রসিদ মুছুন
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className={`border-2 border-dashed ${errors.receiptUrl ? 'border-red-400 bg-red-50/20' : 'border-slate-300'} hover:border-emerald-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition-all hover:bg-emerald-50/30 group`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        disabled={uploadingReceipt}
                        className="hidden"
                      />
                      {uploadingReceipt ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <span className="loading loading-spinner text-emerald-800"></span>
                          <span className="text-xs font-semibold text-emerald-800">ImgBB-তে ছবি আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 mt-1">
                            রসিদ বা স্লিপের ছবি আপলোড করতে এখানে ক্লিক করুন
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ছবি ফরম্যাট: JPG, PNG, JPEG, WEBP (সর্বোচ্চ ১০ মেগাবাইট)
                          </span>
                        </div>
                      )}
                    </label>

                    {uploadError && (
                      <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                      </p>
                    )}
                    {errors.receiptUrl && (
                      <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.receiptUrl}
                      </p>
                    )}
                  </div>
                )}
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

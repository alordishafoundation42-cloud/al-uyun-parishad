const Registration = require('../models/Registration');
const { getDBStatus } = require('../config/db');
const store = require('../utils/store');

// Helper to generate unique registration number: AUP-2026-XXXX
const generateRegNumber = async () => {
  const year = 2026;
  let count = store.registrations.length;
  if (getDBStatus()) {
    try {
      count = await Registration.countDocuments();
    } catch {}
  }
  const serial = 1001 + count;
  return `AUP-${year}-${serial}`;
};

// 1. Submit Registration (Public)
exports.createRegistration = async (req, res) => {
  try {
    const {
      friendName,
      mobile,
      email,
      profession,
      highestDegree,
      kamilSubject,
      presentAddress,
      permanentAddress,
      familyMembers = [],
      paymentMethod = 'বিকাশ',
      transactionId,
      paymentDate,
      senderMobile,
      receiptUrl,
      cashReceiver
    } = req.body;

    // Basic Validation
    if (!friendName || !mobile || !email || !profession || !highestDegree || !presentAddress || !permanentAddress) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য সঠিকভাবে পূরণ করুন।'
      });
    }

    if (highestDegree === 'কামিল' && !kamilSubject) {
      return res.status(400).json({
        success: false,
        message: 'কামিলের বিষয় নির্বাচন করা আবশ্যক।'
      });
    }

    // Check payment method types
    const isCashPayment = Boolean(
      paymentMethod && (
        paymentMethod.includes('হাতে') ||
        paymentMethod.includes('ক্যাশ') ||
        paymentMethod.toLowerCase().includes('cash')
      )
    );

    const isBankPayment = Boolean(
      paymentMethod && (
        paymentMethod.includes('ব্যাংক') ||
        paymentMethod.toLowerCase().includes('bank')
      )
    );

    if (isCashPayment) {
      if (!cashReceiver || !cashReceiver.trim()) {
        return res.status(400).json({
          success: false,
          message: 'হাতে হাতে ক্যাশ ফি জমার ক্ষেত্রে কার কাছে টাকা জমা দিয়েছেন তাঁর নাম প্রদান করা আবশ্যক।'
        });
      }
    } else if (isBankPayment) {
      // ব্যাংক জমা: ডিপোজিট স্লিপের ছবি বাধ্যতামূলক, প্রেরক মোবাইল বা TrxID বাধ্যতামূলক নয়
      if (!receiptUrl || !receiptUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: 'ব্যাংক একাউন্টে ফি জমার ক্ষেত্রে ব্যাংক ডিপোজিট স্লিপের ছবি আপলোড করা আবশ্যক।'
        });
      }
    } else {
      // বিকাশ: রসিদ/স্ক্রিনশট দিলে TrxID লাগবে না, অথবা TrxID দিতে পারে
      const hasReceipt = Boolean(receiptUrl && receiptUrl.trim());
      const hasTrx = Boolean(transactionId && transactionId.trim());

      if (!hasReceipt && !hasTrx) {
        return res.status(400).json({
          success: false,
          message: 'বিকাশ পেমেন্টের ট্রানজ্যাকশন আইডি (TrxID) প্রদান করুন অথবা পেমেন্ট রসিদ/স্ক্রিনশটের ছবি আপলোড করুন।'
        });
      }

      if (!hasReceipt && (!senderMobile || !senderMobile.trim())) {
        return res.status(400).json({
          success: false,
          message: 'বিকাশ প্রেরক মোবাইল নম্বর প্রদান করুন।'
        });
      }
    }

    const cleanMobile = mobile.replace(/\D/g, '');

    // Check duplicate mobile registration
    let existing = store.registrations.find(r => r.mobile === cleanMobile);
    if (!existing && getDBStatus()) {
      try {
        existing = await Registration.findOne({ mobile: cleanMobile });
      } catch {}
    }

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে। সংশোধনের জন্য সমন্বয়কের সাথে যোগাযোগ করুন।'
      });
    }

    // Participant Calculation: 1 (Friend) + familyMembers.length
    // (৩ বছরের শিশুর জন্য কোনো ফি লাগবে না)
    const cleanFamilyMembers = Array.isArray(familyMembers) ? familyMembers.map(m => ({
      name: String(m.name || '').trim(),
      age: Number(m.age) || 1,
      gender: m.gender || 'পুরুষ',
      relationship: m.relationship || 'অন্যান্য'
    })) : [];

    const freeChildrenCount = cleanFamilyMembers.filter(m => {
      const isChild = ['ছেলে', 'মেয়ে', 'অন্যান্য'].includes(m.relationship) && m.relationship !== 'স্ত্রী';
      return isChild && m.age > 0 && m.age <= 3;
    }).length;

    const participantCount = 1 + cleanFamilyMembers.length;
    const payingCount = Math.max(1, participantCount - freeChildrenCount);
    const totalFee = payingCount * 1000;
    const registrationNumber = await generateRegNumber();

    const registrationData = {
      registrationNumber,
      friendName: friendName.trim(),
      mobile: cleanMobile,
      email: email.trim().toLowerCase(),
      profession: profession.trim(),
      highestDegree,
      kamilSubject: highestDegree === 'কামিল' ? kamilSubject : null,
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      familyMembers: cleanFamilyMembers,
      participantCount,
      totalFee,
      paymentMethod: (paymentMethod || 'বিকাশ').trim(),
      cashReceiver: (cashReceiver || '').trim(),
      transactionId: (transactionId && transactionId.trim()) 
        ? transactionId.trim() 
        : (isCashPayment ? `CASH-${cleanMobile.slice(-4)}` : ''),
      paymentDate: paymentDate || new Date(),
      senderMobile: (senderMobile && senderMobile.trim()) ? senderMobile.trim() : cleanMobile,
      receiptUrl: receiptUrl || null,
      paymentStatus: 'Pending',
      registrationStatus: 'অপেক্ষমাণ',
      confirmationEmailStatus: 'Not Sent',
      emailDeliveryLog: [],
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB
    let savedDoc = null;
    if (getDBStatus()) {
      try {
        const reg = new Registration(registrationData);
        savedDoc = await reg.save();
      } catch (err) {
        console.error('MongoDB registration save error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'ডাটাবেজে তথ্য সংরক্ষণে ত্রুটি: ' + err.message
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'ডাটাবেজের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
      });
    }

    registrationData._id = savedDoc ? savedDoc._id.toString() : 'reg_' + Date.now();
    store.registrations.push(registrationData);

    return res.status(201).json({
      success: true,
      message: 'রেজিস্ট্রেশন সফলভাবে সংরক্ষিত হয়েছে।',
      data: {
        registrationNumber: registrationData.registrationNumber,
        friendName: registrationData.friendName,
        participantCount: registrationData.participantCount,
        totalFee: registrationData.totalFee,
        paymentStatus: registrationData.paymentStatus,
        registrationStatus: registrationData.registrationStatus
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'রেজিস্ট্রেশন প্রক্রিয়াকরণে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// 2. Public Registration Status Lookup (Strictly Privacy Compliant & Flexible Search)
exports.getRegistrationStatus = async (req, res) => {
  try {
    const rawParam = String(req.params.registrationNumber || '').trim();
    if (!rawParam) {
      return res.status(400).json({
        success: false,
        message: 'রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর প্রদান করুন।'
      });
    }

    // 1. Convert Bengali digits to English digits
    const banglaToEnglishMap = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    const convertedInput = rawParam.replace(/[০-৯]/g, d => banglaToEnglishMap[d]).trim();
    const upperInput = convertedInput.toUpperCase();
    const digitsOnly = convertedInput.replace(/\D/g, '');

    // Possible search variants
    const searchVariants = [upperInput];

    // If format like AUP20261001 without hyphens -> convert to AUP-2026-1001
    const aupMatch = upperInput.match(/^AUP[ -]?2026[ -]?(\d{4})$/);
    if (aupMatch) {
      searchVariants.push(`AUP-2026-${aupMatch[1]}`);
    }

    // If user entered only serial number (e.g. 1001)
    if (/^\d{4}$/.test(convertedInput)) {
      searchVariants.push(`AUP-2026-${convertedInput}`);
    }

    const isMobileQuery = digitsOnly.length >= 10 && digitsOnly.length <= 11;

    let reg = null;

    // First try store
    reg = store.registrations.find(r => {
      const matchReg = r.registrationNumber && searchVariants.includes(r.registrationNumber.toUpperCase());
      const matchMobile = isMobileQuery && r.mobile && r.mobile.replace(/\D/g, '').endsWith(digitsOnly.slice(-10));
      return matchReg || matchMobile;
    });

    // If not in store, query MongoDB
    if (!reg && getDBStatus()) {
      try {
        const queryConditions = [];

        // Exact match or regex on searchVariants
        searchVariants.forEach(variant => {
          queryConditions.push({ registrationNumber: new RegExp('^' + variant.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') });
        });

        // Search by mobile if 10-11 digits
        if (isMobileQuery) {
          queryConditions.push({ mobile: new RegExp(digitsOnly.slice(-10) + '$') });
        }

        reg = await Registration.findOne({ $or: queryConditions }).lean();
      } catch (dbErr) {
        console.error('Registration status query error:', dbErr.message);
      }
    }

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'প্রদত্ত তথ্য অনুযায়ী কোনো রেজিস্ট্রেশন রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর সঠিকভাবে পরীক্ষা করুন।'
      });
    }

    // Mask mobile for privacy (e.g. 01819***608)
    const rawMobile = String(reg.mobile || '');
    const cleanMob = rawMobile.replace(/\D/g, '');
    const maskedMobile = cleanMob.length >= 7 
      ? `${cleanMob.slice(0, 5)}***${cleanMob.slice(-3)}`
      : '***';

    // Mask Transaction ID if exists
    const rawTrx = String(reg.transactionId || '');
    const maskedTrx = rawTrx && rawTrx !== 'N/A' && !rawTrx.startsWith('CASH-')
      ? (rawTrx.length > 4 ? `***${rawTrx.slice(-4)}` : rawTrx)
      : null;

    // Strictly return only privacy-safe fields:
    return res.status(200).json({
      success: true,
      data: {
        registrationNumber: reg.registrationNumber,
        friendName: reg.friendName,
        maskedMobile,
        participantCount: reg.participantCount,
        totalFee: reg.totalFee,
        paymentStatus: reg.paymentStatus, // 'Pending' | 'Verified' | 'Rejected'
        registrationStatus: reg.registrationStatus, // 'অপেক্ষমাণ' | 'নিশ্চিত' | 'বাতিল'
        paymentMethod: reg.paymentMethod || 'ক্যাশ/ব্যাংক/বিকাশ',
        paymentDate: reg.paymentDate || null,
        cashReceiver: reg.cashReceiver || null,
        maskedTransactionId: maskedTrx,
        hasReceipt: Boolean(reg.receiptUrl),
        receiptUrl: reg.receiptUrl || null,
        familyMembersCount: Array.isArray(reg.familyMembers) ? reg.familyMembers.length : 0,
        familyMembersList: Array.isArray(reg.familyMembers) ? reg.familyMembers.map(m => ({
          name: m.name,
          relationship: m.relationship
        })) : [],
        createdAt: reg.createdAt
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'স্ট্যাটাস অনুসন্ধানে সমস্যা হয়েছে: ' + error.message
    });
  }
};

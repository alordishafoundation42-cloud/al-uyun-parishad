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
      paymentMethod,
      transactionId,
      paymentDate,
      senderMobile,
      receiptUrl
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

    if (!transactionId || !senderMobile) {
      return res.status(400).json({
        success: false,
        message: 'পেমেন্টের ট্রানজ্যাকশন আইডি ও প্রেরক মোবাইল নম্বর প্রদান করুন।'
      });
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
      paymentMethod,
      transactionId: transactionId.trim(),
      paymentDate: paymentDate || new Date(),
      senderMobile: senderMobile.trim(),
      receiptUrl: receiptUrl || null,
      paymentStatus: 'Pending',
      registrationStatus: 'অপেক্ষমাণ',
      confirmationEmailStatus: 'Not Sent',
      emailDeliveryLog: [],
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB if connected
    let savedDoc = null;
    if (getDBStatus()) {
      try {
        const reg = new Registration(registrationData);
        savedDoc = await reg.save();
      } catch (err) {
        console.error('MongoDB registration save error:', err.message);
      }
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

// 2. Public Registration Status Lookup (Strictly Privacy Compliant)
exports.getRegistrationStatus = async (req, res) => {
  try {
    const regNo = req.params.registrationNumber.trim().toUpperCase();

    let reg = store.registrations.find(r => r.registrationNumber === regNo);
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findOne({ registrationNumber: regNo });
      } catch {}
    }

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'প্রদত্ত রেজিস্ট্রেশন নম্বরটি পাওয়া যায়নি।'
      });
    }

    // Strictly return only privacy-safe fields:
    return res.status(200).json({
      success: true,
      data: {
        registrationNumber: reg.registrationNumber,
        friendName: reg.friendName,
        participantCount: reg.participantCount,
        totalFee: reg.totalFee,
        paymentStatus: reg.paymentStatus,
        registrationStatus: reg.registrationStatus
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'স্ট্যাটাস অনুসন্ধানে সমস্যা হয়েছে: ' + error.message
    });
  }
};

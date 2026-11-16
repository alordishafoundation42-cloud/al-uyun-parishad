const Registration = require('../models/Registration');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const WebsiteSettings = require('../models/WebsiteSettings');
const { getDBStatus } = require('../config/db');
const store = require('../utils/store');
const { sendPaymentConfirmationEmail, sendQuizResultEmail } = require('../utils/emailService');

// 1. Dashboard Overview Stats
exports.getDashboardStats = async (req, res) => {
  try {
    let list = store.registrations;
    if (getDBStatus()) {
      try {
        list = await Registration.find();
      } catch {}
    }

    let totalParticipants = 0;
    let totalExpectedFee = 0;
    let totalVerifiedPayments = 0;
    let pendingCount = 0;

    list.forEach(r => {
      totalParticipants += (r.participantCount || 1);
      totalExpectedFee += (r.totalFee || 1000);
      if (r.paymentStatus === 'Verified') {
        totalVerifiedPayments += (r.totalFee || 1000);
      } else if (r.paymentStatus === 'Pending') {
        pendingCount += 1;
      }
    });

    let totalQuizParticipants = store.attempts.length;
    let completedQuizCount = store.attempts.filter(a => a.attemptStatus === 'Completed').length;
    if (getDBStatus()) {
      try {
        totalQuizParticipants = await QuizAttempt.countDocuments();
        completedQuizCount = await QuizAttempt.countDocuments({ attemptStatus: 'Completed' });
      } catch (err) {}
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRegistrations: list.length,
        totalParticipants,
        totalExpectedFee,
        totalVerifiedPayments,
        pendingPaymentsCount: pendingCount,
        totalQuizParticipants,
        completedQuizCount
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Registrations with Search & Filter
exports.getRegistrations = async (req, res) => {
  try {
    const { search, paymentStatus, page = 1, limit = 20 } = req.query;

    let list = [...store.registrations];
    if (getDBStatus()) {
      try {
        list = await Registration.find().sort({ createdAt: -1 });
      } catch {}
    }

    if (paymentStatus && paymentStatus !== 'All') {
      list = list.filter(r => r.paymentStatus === paymentStatus);
    }

    if (search) {
      const s = search.trim().toLowerCase();
      list = list.filter(r => 
        r.friendName.toLowerCase().includes(s) || 
        r.mobile.includes(s) || 
        r.registrationNumber.toLowerCase().includes(s)
      );
    }

    const total = list.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = list.slice(skip, skip + Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        registrations: paginated,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Registration
exports.getRegistrationById = async (req, res) => {
  try {
    let reg = store.registrations.find(r => String(r._id) === String(req.params.id));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(req.params.id);
      } catch {}
    }
    if (!reg) {
      return res.status(404).json({ success: false, message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
    }
    return res.status(200).json({ success: true, data: reg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Registration
exports.updateRegistration = async (req, res) => {
  try {
    let reg = store.registrations.find(r => String(r._id) === String(req.params.id));
    if (reg) {
      Object.assign(reg, req.body);
    }
    if (getDBStatus()) {
      try {
        reg = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
      } catch {}
    }
    return res.status(200).json({
      success: true,
      message: 'রেজিস্ট্রেশন তথ্য সফলভাবে সংশোধন করা হয়েছে।',
      data: reg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Registration
exports.deleteRegistration = async (req, res) => {
  try {
    const idx = store.registrations.findIndex(r => String(r._id) === String(req.params.id));
    if (idx !== -1) {
      store.registrations.splice(idx, 1);
    }
    if (getDBStatus()) {
      try {
        await Registration.findByIdAndDelete(req.params.id);
      } catch {}
    }
    return res.status(200).json({
      success: true,
      message: 'রেজিস্ট্রেশন সফলভাবে মুছে ফেলা হয়েছে।'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Verify Payment & Send Email
exports.verifyPayment = async (req, res) => {
  try {
    let reg = store.registrations.find(r => String(r._id) === String(req.params.id));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(req.params.id);
      } catch {}
    }

    if (!reg) {
      return res.status(404).json({ success: false, message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
    }

    reg.paymentStatus = 'Verified';
    reg.registrationStatus = 'নিশ্চিত';
    reg.paymentVerifiedAt = new Date();
    if (req.body.adminNote) {
      reg.adminNote = req.body.adminNote;
    }

    let emailSuccess = false;
    try {
      await sendPaymentConfirmationEmail({
        toEmail: reg.email,
        friendName: reg.friendName,
        registrationNumber: reg.registrationNumber,
        participantCount: reg.participantCount,
        totalFee: reg.totalFee
      });
      emailSuccess = true;
      reg.confirmationEmailStatus = 'Sent';
      reg.emailDeliveryLog = reg.emailDeliveryLog || [];
      reg.emailDeliveryLog.push({ sentAt: new Date(), status: 'Success' });
    } catch (mailErr) {
      reg.confirmationEmailStatus = 'Failed';
      reg.emailDeliveryLog = reg.emailDeliveryLog || [];
      reg.emailDeliveryLog.push({ sentAt: new Date(), status: 'Failed', error: mailErr.message });
    }

    if (getDBStatus()) {
      try {
        if (reg.save) {
          await reg.save();
        } else {
          await Registration.findByIdAndUpdate(req.params.id, {
            paymentStatus: reg.paymentStatus,
            registrationStatus: reg.registrationStatus,
            paymentVerifiedAt: reg.paymentVerifiedAt,
            adminNote: reg.adminNote,
            confirmationEmailStatus: reg.confirmationEmailStatus,
            emailDeliveryLog: reg.emailDeliveryLog
          });
        }
      } catch (err) {
        console.error('Payment verify DB update error:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `পেমেন্ট সফলভাবে যাচাইকৃত হয়েছে। ${emailSuccess ? 'ইমেইল নিশ্চিতকরণ পাঠানো হয়েছে।' : 'ইমেইল সিমুলেশন সম্পন্ন।'}`,
      data: reg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Reject Payment
exports.rejectPayment = async (req, res) => {
  try {
    const { adminNote } = req.body;
    let reg = store.registrations.find(r => String(r._id) === String(req.params.id));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(req.params.id);
      } catch {}
    }

    if (!reg) {
      return res.status(404).json({ success: false, message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
    }

    reg.paymentStatus = 'Rejected';
    reg.registrationStatus = 'বাতিল';
    reg.adminNote = adminNote || 'পেমেন্ট তথ্যের অসঙ্গতি';

    if (getDBStatus()) {
      try {
        if (reg.save) {
          await reg.save();
        } else {
          await Registration.findByIdAndUpdate(req.params.id, {
            paymentStatus: reg.paymentStatus,
            registrationStatus: reg.registrationStatus,
            paymentVerifiedAt: reg.paymentVerifiedAt,
            adminNote: reg.adminNote,
            confirmationEmailStatus: reg.confirmationEmailStatus,
            emailDeliveryLog: reg.emailDeliveryLog
          });
        }
      } catch (err) {
        console.error('Payment verify DB update error:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'পেমেন্ট প্রত্যাখ্যান করা হয়েছে।',
      data: reg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Resend Confirmation Email
exports.resendConfirmationEmail = async (req, res) => {
  try {
    let reg = store.registrations.find(r => String(r._id) === String(req.params.id));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(req.params.id);
      } catch {}
    }

    if (!reg) {
      return res.status(404).json({ success: false, message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
    }

    if (reg.paymentStatus !== 'Verified') {
      return res.status(400).json({
        success: false,
        message: 'পেমেন্ট যাচাই না হওয়া পর্যন্ত নিশ্চিতকরণ ইমেইল পাঠানো যাবে না।'
      });
    }

    await sendPaymentConfirmationEmail({
      toEmail: reg.email,
      friendName: reg.friendName,
      registrationNumber: reg.registrationNumber,
      participantCount: reg.participantCount,
      totalFee: reg.totalFee
    });

    reg.confirmationEmailStatus = 'Sent';
    reg.emailDeliveryLog = reg.emailDeliveryLog || [];
    reg.emailDeliveryLog.push({ sentAt: new Date(), status: 'Success' });

    return res.status(200).json({
      success: true,
      message: 'নিশ্চিতকরণ ইমেইল সফলভাবে পুনরায় পাঠানো হয়েছে।'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Export Registrations as CSV
exports.exportRegistrationsCSV = async (req, res) => {
  try {
    let list = [];
    if (getDBStatus()) {
      try {
        list = await Registration.find().sort({ createdAt: 1 });
      } catch (dbErr) {
        console.error('CSV Export DB query error:', dbErr.message);
      }
    }

    // Fallback to in-memory store if DB is empty or offline and store has records
    if ((!list || list.length === 0) && store.registrations && store.registrations.length > 0) {
      list = store.registrations;
    }

    const header = [
      'রেজিস্ট্রেশন নম্বর',
      'বন্ধুর নাম',
      'মোবাইল নম্বর',
      'ইমেইল',
      'পেশা',
      'সর্বোচ্চ ডিগ্রি',
      'কামিল বিষয়',
      'বর্তমান ঠিকানা',
      'স্থায়ী ঠিকানা',
      'মোট অংশগ্রহণকারী (জন)',
      'পারিবারিক সদস্য সংখ্যা',
      'পারিবারিক সদস্যদের বিস্তারিত বিবরণ',
      'মোট শুভেচ্ছা ফি (টাকা)',
      'পেমেন্ট মাধ্যম',
      'ক্যাশ জমার গ্রহীতা (কার কাছে জমা)',
      'ট্রানজেকশন আইডি (TrxID)',
      'টাকা প্রেরক নম্বর',
      'পেমেন্টের তারিখ',
      'পেমেন্ট অবস্থা',
      'রেজিস্ট্রেশন অবস্থা',
      'পেমেন্ট যাচাইয়ের সময়',
      'এডমিন নোট',
      'রেজিস্ট্রেশনের তারিখ ও সময়'
    ];

    const safeVal = (v) => {
      if (v === undefined || v === null) return '""';
      const str = String(v).replace(/"/g, '""');
      return `"${str}"`;
    };

    const formatDate = (d) => {
      if (!d) return '';
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d);
        return dt.toISOString().replace('T', ' ').substring(0, 19);
      } catch {
        return String(d);
      }
    };

    const rows = (list || []).map(r => {
      const familyCount = (r.familyMembers && Array.isArray(r.familyMembers)) ? r.familyMembers.length : 0;
      const familyDetails = (familyCount > 0)
        ? r.familyMembers.map(m => `${m.name || 'সদস্য'} (${m.relationship || 'সম্পর্ক অজ্ঞাত'}, ${m.age || 0} বছর, ${m.gender || ''})`).join('; ')
        : 'পারিবারিক সদস্য নেই';

      return [
        safeVal(r.registrationNumber),
        safeVal(r.friendName),
        safeVal(r.mobile),
        safeVal(r.email),
        safeVal(r.profession),
        safeVal(r.highestDegree),
        safeVal(r.kamilSubject || 'প্রযোজ্য নয়'),
        safeVal(r.presentAddress),
        safeVal(r.permanentAddress),
        safeVal(r.participantCount || (1 + familyCount)),
        safeVal(familyCount),
        safeVal(familyDetails),
        safeVal(r.totalFee || 1000),
        safeVal(r.paymentMethod),
        safeVal(r.cashReceiver || (r.paymentMethod && r.paymentMethod.includes('হাতে') ? 'উল্লেখ নেই' : 'প্রযোজ্য নয়')),
        safeVal(r.transactionId),
        safeVal(r.senderMobile),
        safeVal(formatDate(r.paymentDate)),
        safeVal(r.paymentStatus),
        safeVal(r.registrationStatus),
        safeVal(formatDate(r.paymentVerifiedAt)),
        safeVal(r.adminNote || ''),
        safeVal(formatDate(r.createdAt))
      ].join(',');
    });

    const csvContent = [header.join(','), ...rows].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Al_Uyun_Parishad_2026_Registrations.csv"');
    return res.status(200).send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Export CSV Error:', error);
    return res.status(500).json({ success: false, message: 'CSV ফাইল প্রস্তুত করতে ব্যর্থ হয়েছে: ' + error.message });
  }
};

// 10. Quiz Questions Management
exports.getQuizQuestions = async (req, res) => {
  return res.status(200).json({ success: true, data: store.questions });
};

exports.addQuizQuestion = async (req, res) => {
  const q = { _id: 'iq_' + Date.now(), ...req.body };
  store.questions.push(q);
  return res.status(201).json({ success: true, message: 'প্রশ্ন যুক্ত হয়েছে।', data: q });
};

exports.updateQuizQuestion = async (req, res) => {
  const idx = store.questions.findIndex(q => String(q._id) === String(req.params.id));
  if (idx !== -1) {
    Object.assign(store.questions[idx], req.body);
  }
  return res.status(200).json({ success: true, message: 'প্রশ্ন আপডেট হয়েছে।' });
};

exports.deleteQuizQuestion = async (req, res) => {
  const idx = store.questions.findIndex(q => String(q._id) === String(req.params.id));
  if (idx !== -1) {
    store.questions.splice(idx, 1);
  }
  return res.status(200).json({ success: true, message: 'প্রশ্ন মুছে ফেলা হয়েছে।' });
};

// 11. Publish Quiz Results & Trigger Result Emails
exports.publishQuizResults = async (req, res) => {
  try {
    store.settings.isQuizResultsPublished = true;
    let emailsSent = 0;

    const attempts = [...store.attempts].sort((a, b) => b.score - a.score || a.completionTime - b.completionTime);

    for (let i = 0; i < attempts.length; i++) {
      const att = attempts[i];
      const reg = store.registrations.find(r => String(r._id) === String(att.registrationId));
      const fatherEmail = reg?.email;
      const fatherName = reg?.friendName || 'সম্মানিত বন্ধু';
      const rank = i + 1;
      const isTopThree = rank <= 3;

      if (fatherEmail) {
        try {
          await sendQuizResultEmail({
            toEmail: fatherEmail,
            fatherName,
            childName: att.childName,
            score: att.score,
            totalMarks: att.totalMarks || 10,
            rank,
            isTopThree
          });
          emailsSent += 1;
        } catch (e) {
          console.error(`Failed to send result email:`, e.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `কুইজের ফলাফল সফলভাবে প্রকাশিত হয়েছে। ${emailsSent} জন অভিভাবককে ফলাফল ইমেইল পাঠানো হয়েছে।`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 12. Unpublish Quiz Results
exports.unpublishQuizResults = async (req, res) => {
  store.settings.isQuizResultsPublished = false;
  return res.status(200).json({
    success: true,
    message: 'কুইজের ফলাফল অপ্রকাশিত করা হয়েছে।'
  });
};

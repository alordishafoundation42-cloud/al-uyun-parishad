const Registration = require('../models/Registration');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const WebsiteSettings = require('../models/WebsiteSettings');
const { getDBStatus } = require('../config/db');
const store = require('../utils/store');

// Helper: Distractor generator for Father questions (safe, no private data leaking)
const getDistractors = (type, correctAnswer) => {
  const pools = {
    profession: ['শিক্ষকতা', 'ব্যবসা', 'আইনজীবী', 'চিকিৎসক', 'সরকারি চাকরি', 'বেসরকারি চাকরি', 'প্রকৌশলী'],
    degree: ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', 'স্নাতক', 'স্নাতকোত্তর', 'পিএইচডি'],
    kamilSubject: ['আদব', 'ফিকহ', 'তাফসির', 'হাদিস'],
    district: ['চট্টগ্রাম', 'ঢাকা', 'কুমিল্লা', 'ফেনী', 'কক্সবাজার', 'সিলেট', 'নোয়াখালী']
  };

  const pool = pools[type] || ['বিকল্প ক', 'বিকল্প খ', 'বিকল্প গ'];
  const filtered = pool.filter(item => item !== correctAnswer);
  const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  return [...shuffled, correctAnswer].sort(() => 0.5 - Math.random());
};

// 1. Verify Child Eligibility (Venue based)
exports.verifyChild = async (req, res) => {
  try {
    const { mobile, childName } = req.body;

    if (!mobile || !childName) {
      return res.status(400).json({
        success: false,
        message: 'বাবার মোবাইল নম্বর ও সন্তানের নাম প্রদান আবশ্যক।'
      });
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanChildName = childName.trim();

    // 1. Find Father's Registration
    let reg = store.registrations.find(r => r.mobile === cleanMobile);
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findOne({ mobile: cleanMobile });
      } catch {}
    }

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'প্রদত্ত মোবাইল নম্বর দিয়ে কোনো রেজিস্ট্রেশন পাওয়া যায়নি।'
      });
    }

    // 2. Check if child is in family members
    const matchingChild = reg.familyMembers.find(m => {
      const isNameMatch = m.name.toLowerCase().includes(cleanChildName.toLowerCase()) || 
                          cleanChildName.toLowerCase().includes(m.name.toLowerCase());
      const isChildRelation = ['ছেলে', 'মেয়ে', 'সন্তান'].includes(m.relationship);
      return isNameMatch && isChildRelation;
    });

    if (!matchingChild) {
      return res.status(403).json({
        success: false,
        message: 'প্রদত্ত পিতা ও সন্তানের তথ্যের মিল পাওয়া যায়নি অথবা সন্তান হিসেবে নিবন্ধিত নয়।'
      });
    }

    // 3. Check for duplicate attempt
    const childIdentifier = `${cleanMobile}_${matchingChild.name.toLowerCase().replace(/\s+/g, '')}`;
    let existingAttempt = store.attempts.find(a => 
      a.childIdentifier === childIdentifier && ['Completed', 'Expired'].includes(a.attemptStatus)
    );
    if (!existingAttempt && getDBStatus()) {
      try {
        existingAttempt = await QuizAttempt.findOne({ 
          childIdentifier,
          attemptStatus: { $in: ['Completed', 'Expired'] }
        });
      } catch {}
    }

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: 'এই সন্তান ইতিমধ্যে কুইজে অংশগ্রহণ সম্পন্ন করেছে। দ্বিতীয়বার অংশগ্রহণের সুযোগ নেই।'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'তথ্য সফলভাবে যাচাইকৃত। কুইজে অংশগ্রহণের অনুমতি দেওয়া হলো।',
      data: {
        registrationId: reg._id,
        childName: matchingChild.name,
        childIdentifier,
        fatherName: reg.friendName
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'যাচাই প্রক্রিয়ায় সমস্যা হয়েছে: ' + error.message
    });
  }
};

// 2. Start Quiz & Get Questions (Backend Controlled Timer)
exports.startQuiz = async (req, res) => {
  try {
    const { registrationId, childName, childIdentifier } = req.body;

    if (!childIdentifier || !registrationId) {
      return res.status(400).json({
        success: false,
        message: 'অংশগ্রহণকারীর তথ্য অসম্পূর্ণ।'
      });
    }

    let attempt = store.attempts.find(a => a.childIdentifier === childIdentifier);
    if (!attempt && getDBStatus()) {
      try {
        attempt = await QuizAttempt.findOne({ childIdentifier });
      } catch {}
    }

    const now = new Date();
    const durationMinutes = 20;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    if (!attempt) {
      let savedAtt = null;
      if (getDBStatus()) {
        try {
          const newAtt = new QuizAttempt({
            registrationId,
            childName,
            childIdentifier,
            startedAt: now,
            expiresAt,
            attemptStatus: 'InProgress',
            answers: [],
            score: 0,
            totalMarks: 0,
            completionTime: 0
          });
          savedAtt = await newAtt.save();
        } catch (err) {
          console.error('QuizAttempt save error:', err.message);
        }
      }

      attempt = {
        _id: savedAtt ? savedAtt._id.toString() : 'att_' + Date.now(),
        registrationId,
        childName,
        childIdentifier,
        startedAt: now,
        expiresAt,
        attemptStatus: 'InProgress',
        answers: [],
        score: 0,
        totalMarks: 0,
        completionTime: 0
      };
      store.attempts.push(attempt);
    } else if (attempt.attemptStatus !== 'InProgress') {
      return res.status(409).json({
        success: false,
        message: 'এই কুইজ ইতিমধ্যে সমাপ্ত হয়েছে।'
      });
    }

    // Load father's registration to dynamically build Father Questions
    let reg = store.registrations.find(r => String(r._id) === String(registrationId));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(registrationId);
      } catch {}
    }

    const questionsList = [];

    // Category 1: বাবার নিবন্ধিত তথ্যভিত্তিক প্রশ্ন — ৪টি (reg থেকে dynamic)
    if (reg) {
      // প্রশ্ন ১: বাবার নাম
      const namePool = [
        reg.friendName,
        'মাওলানা আব্দুর রহমান',
        'কাজী সাইফুল ইসলাম',
        'মুহাম্মদ ইব্রাহিম হোসেন',
        'মাওলানা রফিকুল হক'
      ].filter((v, i, a) => a.indexOf(v) === i);
      const nameOptions = [
        ...namePool.filter(n => n !== reg.friendName).sort(() => 0.5 - Math.random()).slice(0, 3),
        reg.friendName
      ].sort(() => 0.5 - Math.random());

      questionsList.push({
        id: 'father_name',
        question: 'তোমার বাবার নিবন্ধিত পূর্ণ নাম কোনটি?',
        options: nameOptions,
        marks: 1
      });

      // প্রশ্ন ২: বাবার পেশা
      if (reg.profession) {
        questionsList.push({
          id: 'father_prof',
          question: 'তোমার বাবার পেশা কী?',
          options: getDistractors('profession', reg.profession),
          marks: 1
        });
      }

      // প্রশ্ন ৩: বাবার শিক্ষাগত যোগ্যতা
      if (reg.highestDegree) {
        questionsList.push({
          id: 'father_degree',
          question: 'তোমার বাবার সর্বোচ্চ শিক্ষাগত যোগ্যতা কোনটি?',
          options: getDistractors('degree', reg.highestDegree),
          marks: 1
        });
      }

      // প্রশ্ন ৪: কামিল বিষয় (যদি থাকে) অথবা জেলা
      if (reg.highestDegree === 'কামিল' && reg.kamilSubject) {
        questionsList.push({
          id: 'father_kamil',
          question: 'তোমার বাবা কামিল কোন বিষয়ে সম্পন্ন করেছেন?',
          options: getDistractors('kamilSubject', reg.kamilSubject),
          marks: 1
        });
      } else if (reg.permanentDistrict || reg.presentDistrict) {
        const district = reg.permanentDistrict || reg.presentDistrict;
        questionsList.push({
          id: 'father_district',
          question: 'তোমার বাবার স্থায়ী ঠিকানার জেলা কোনটি?',
          options: getDistractors('district', district),
          marks: 1
        });
      }
    }

    // Category 2: ইসলামিক প্রশ্ন — store থেকে সব active প্রশ্ন লোড, shuffle করে নাও
    let islamicQs = [];
    if (getDBStatus()) {
      try {
        islamicQs = await QuizQuestion.find({ isActive: true }).lean();
      } catch {}
    }
    if (islamicQs.length === 0) {
      islamicQs = store.questions.filter(q => q.isActive);
    }

    // ১৬টি ইসলামিক প্রশ্ন নাও (shuffle করে)
    const shuffledIslamic = islamicQs.sort(() => 0.5 - Math.random());
    const islamicNeeded = Math.max(16, 20 - questionsList.length);
    shuffledIslamic.slice(0, islamicNeeded).forEach((q, idx) => {
      questionsList.push({
        id: 'iq_' + (q._id || idx),
        question: q.question,
        options: [...q.options].sort(() => 0.5 - Math.random()),
        marks: q.marks || 1
      });
    });

    // মোট ২০টি নিশ্চিত করো (বেশি হলে কাটো)
    const finalQuestions = questionsList.slice(0, 20);

    const remainingSeconds = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));

    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        childName,
        expiresAt: attempt.expiresAt,
        remainingSeconds,
        questions: finalQuestions
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'কুইজ শুরু করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// 3. Submit Quiz & Backend Scoring
exports.submitQuiz = async (req, res) => {
  try {
    const { attemptId, childIdentifier, answers = [] } = req.body;

    let attempt = store.attempts.find(a => 
      String(a._id) === String(attemptId) || a.childIdentifier === childIdentifier
    );
    if (!attempt && getDBStatus()) {
      try {
        attempt = await QuizAttempt.findOne({ 
          $or: [{ _id: attemptId }, { childIdentifier }] 
        });
      } catch {}
    }

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'কুইজ রেকর্ডটি পাওয়া যায়নি।'
      });
    }

    if (attempt.attemptStatus === 'Completed') {
      return res.status(200).json({
        success: true,
        message: 'কুইজ ইতিমধ্যে জমা নেওয়া হয়েছে।',
        score: attempt.score,
        totalMarks: attempt.totalMarks
      });
    }

    const now = new Date();
    const isExpired = now.getTime() > new Date(attempt.expiresAt).getTime() + 15000;

    let reg = store.registrations.find(r => String(r._id) === String(attempt.registrationId));
    if (!reg && getDBStatus()) {
      try {
        reg = await Registration.findById(attempt.registrationId);
      } catch {}
    }

    let totalScore = 0;
    let totalPossibleMarks = 0;
    const evaluatedAnswers = [];

    const correctMap = {};
    if (reg) {
      correctMap['father_prof'] = reg.profession;
      correctMap['father_degree'] = reg.highestDegree;
      correctMap['father_kamil'] = reg.kamilSubject;
      correctMap['father_name'] = reg.friendName;
      correctMap['father_district'] = reg.permanentDistrict || reg.presentDistrict;
    }

    // ইসলামিক প্রশ্নের সঠিক উত্তর map — DB থেকে লোড করার চেষ্টা
    let allQuestions = store.questions;
    if (getDBStatus()) {
      try {
        const dbQs = await QuizQuestion.find({ isActive: true }).lean();
        if (dbQs.length > 0) allQuestions = dbQs;
      } catch {}
    }
    allQuestions.forEach(q => {
      correctMap['iq_' + q._id] = q.correctAnswer;
    });

    answers.forEach(ans => {
      totalPossibleMarks += 1;
      const expected = correctMap[ans.questionId];
      const isCorrect = expected && String(ans.selectedOption).trim() === String(expected).trim();
      if (isCorrect) {
        totalScore += 1;
      }
      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect: !!isCorrect,
        marksObtained: isCorrect ? 1 : 0
      });
    });

    const completionSeconds = Math.max(1, Math.round((now.getTime() - new Date(attempt.startedAt).getTime()) / 1000));

    attempt.submittedAt = now;
    attempt.answers = evaluatedAnswers;
    attempt.score = totalScore;
    attempt.totalMarks = Math.max(totalPossibleMarks, evaluatedAnswers.length);
    attempt.completionTime = completionSeconds;
    attempt.attemptStatus = isExpired ? 'Expired' : 'Completed';

    if (getDBStatus()) {
      try {
        await QuizAttempt.updateOne(
          { childIdentifier: attempt.childIdentifier },
          {
            $set: {
              submittedAt: now,
              answers: evaluatedAnswers,
              score: totalScore,
              totalMarks: attempt.totalMarks,
              completionTime: completionSeconds,
              attemptStatus: attempt.attemptStatus
            }
          }
        );
      } catch (err) {
        console.error('QuizAttempt update error:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'কুইজ সফলভাবে সমাপ্ত হয়েছে।',
      data: {
        score: totalScore,
        totalMarks: attempt.totalMarks,
        completionTime: completionSeconds,
        attemptStatus: attempt.attemptStatus
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'কুইজ জমা দিতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// 4. Public Quiz Results (Published Only)
exports.getPublicResults = async (req, res) => {
  try {
    const isPublished = store.settings.isQuizResultsPublished;

    if (!isPublished) {
      return res.status(200).json({
        success: true,
        isPublished: false,
        message: 'কুইজ প্রতিযোগিতার চূড়ান্ত ফলাফল এখনো প্রকাশ করা হয়নি।'
      });
    }

    // Rank attempts: score desc, completionTime asc
    const attempts = [...store.attempts]
      .filter(a => ['Completed', 'Expired'].includes(a.attemptStatus))
      .sort((a, b) => b.score - a.score || a.completionTime - b.completionTime);

    const rankings = attempts.map((att, idx) => {
      const minutes = Math.floor(att.completionTime / 60);
      const seconds = att.completionTime % 60;
      const reg = store.registrations.find(r => String(r._id) === String(att.registrationId));
      return {
        rank: idx + 1,
        childName: att.childName,
        fatherName: reg?.friendName || 'সম্মানিত অভিভাবক',
        score: att.score,
        totalMarks: att.totalMarks || 10,
        completionTime: `${minutes} মিনিট ${seconds} সেকেন্ড`,
        isWinner: idx < 3
      };
    });

    return res.status(200).json({
      success: true,
      isPublished: true,
      data: rankings
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'ফলাফল লোড করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

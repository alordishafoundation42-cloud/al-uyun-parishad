const WebsiteSettings = require('../models/WebsiteSettings');

let inMemorySettings = {
  key: 'global_settings',
  eventName: 'আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)',
  eventDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
  eventVenue: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম',
  perPersonFee: 1000,
  contactPerson: 'কাজী একেএম সাইফুদ্দিন মামুন',
  contactMobile: '+880 1819-173608',
  bankName: 'আল-আরাফাহ্ ইসলামী ব্যাংক লিমিটেড',
  bankBranch: 'মুরাদপুর শাখা, চট্টগ্রাম',
  bankAccountName: 'ALYOUN PORISHAD',
  bankAccountNumber: '1091120017273',
  bankAccountType: 'মুদারাবা সঞ্চয়ী হিসাব (MSD)',
  quizDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
  quizOpeningTime: '11:00 AM',
  quizDurationMinutes: 20,
  isQuizEnabled: true,
  isQuizResultsPublished: false,
  formOptions: {
    relationships: ['স্ত্রী', 'ছেলে', 'মেয়ে', 'অন্যান্য'],
    degrees: ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', 'স্নাতক', 'স্নাতকোত্তর', 'এমফিল', 'পিএইচডি', 'অন্যান্য'],
    kamilSubjects: ['আদব', 'ফিকহ', 'তাফসির', 'হাদিস'],
    paymentMethods: ['বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক ট্রান্সফার']
  }
};

// Public: Get Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne({ key: 'global_settings' }).catch(() => null);
    if (!settings) {
      settings = inMemorySettings;
    }
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'সেটিংস লোড করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// Admin: Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings;
    try {
      settings = await WebsiteSettings.findOneAndUpdate(
        { key: 'global_settings' },
        { $set: updates },
        { new: true, upsert: true }
      );
    } catch {
      inMemorySettings = { ...inMemorySettings, ...updates };
      settings = inMemorySettings;
    }

    return res.status(200).json({
      success: true,
      message: 'ওয়েবসাইট সেটিংস সফলভাবে হালনাগাদ করা হয়েছে।',
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'সেটিংস হালনাগাদ করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_settings', unique: true },
  eventName: { type: String, default: 'আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)' },
  eventDate: { type: String, default: '১২ ডিসেম্বর ২০২৬, শনিবার' },
  eventVenue: { type: String, default: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম' },
  perPersonFee: { type: Number, default: 1000 },
  contactPerson: { type: String, default: 'কাজী একেএম সাইফুদ্দিন মামুন' },
  contactMobile: { type: String, default: '+880 1819-173608' },
  quizDate: { type: String, default: '১২ ডিসেম্বর ২০২৬, শনিবার' },
  quizOpeningTime: { type: String, default: '11:00 AM' },
  quizDurationMinutes: { type: Number, default: 20 },
  isQuizEnabled: { type: Boolean, default: false },
  isQuizResultsPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);

// Shared in-memory data store for local dev / offline mode
class DataStore {
  constructor() {
    this.registrations = [];
    this.attempts = [];
    this.questions = [
      {
        _id: 'iq_1',
        question: 'ইসলামের মৌলিক স্তম্ভ কয়টি?',
        options: ['৩টি', '৪টি', '৫টি', '৬টি'],
        correctAnswer: '৫টি',
        category: 'সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_2',
        question: 'পবিত্র কুরআনুল কারিম কোন সম্মানিত মাসে প্রথম নাজিল হয়?',
        options: ['মহররম', 'রমজান', 'রজব', 'জিলহজ্জ'],
        correctAnswer: 'রমজান',
        category: 'সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_3',
        question: 'দৈনিক কয় ওয়াক্ত নামাজ আদায় করা প্রত্যেক মুসলমানের উপর ফরজ?',
        options: ['৩ ওয়াক্ত', '৪ ওয়াক্ত', '৫ ওয়াক্ত', '৭ ওয়াক্ত'],
        correctAnswer: '৫ ওয়াক্ত',
        category: 'সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_4',
        question: 'সর্বশেষ ও সর্বশ্রেষ্ঠ নবী ও রাসুল কে?',
        options: ['হযরত ইব্রাহিম (আ.)', 'হযরত মুসা (আ.)', 'হযরত মুহাম্মদ (সা.)', 'হযরত ঈসা (আ.)'],
        correctAnswer: 'হযরত মুহাম্মদ (সা.)',
        category: 'সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_5',
        question: 'পিতা-মাতার সাথে কিরূপ ব্যবহার করা আল্লাহর নির্দেশ?',
        options: ['উত্তম ও বিনম্র আচরণ', 'কঠোর আচরণ', 'উপেক্ষা করা', 'অন্যান্য'],
        correctAnswer: 'উত্তম ও বিনম্র আচরণ',
        category: 'সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      }
    ];
    this.gallery = [
      {
        _id: 'g1',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        caption: 'হোটেল সৈকত সংবর্ধনা ভেন্যু — সাঙ্গু হল',
        category: 'ভেন্যু ও প্রস্তুতি',
        isPublished: true,
        uploadedAt: new Date()
      }
    ];
    this.settings = {
      key: 'global_settings',
      eventName: 'আল উয়ূন পরিষদ — বার্ষিক পারিবারিক মিলনমেলা–২০২৬',
      eventDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
      eventVenue: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম',
      perPersonFee: 1000,
      contactPerson: 'কাজী একেএম সাইফুদ্দিন মামুন',
      contactMobile: '+880 1819-173608',
      quizDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
      quizOpeningTime: '11:00 AM',
      quizDurationMinutes: 20,
      isQuizEnabled: true,
      isQuizResultsPublished: false
    };
  }
}

module.exports = new DataStore();

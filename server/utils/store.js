// Shared in-memory data store for local dev / offline mode
class DataStore {
  constructor() {
    this.registrations = [];
    this.attempts = [];
    this.questions = [
      // ---- ইসলামিক প্রশ্ন (১৬টি) — অনেকেই ভুল করে এমন ----
      {
        _id: 'iq_1',
        question: 'ইসলামের মৌলিক স্তম্ভ কয়টি?',
        options: ['৩টি', '৪টি', '৫টি', '৬টি'],
        correctAnswer: '৫টি',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_2',
        question: 'পবিত্র কুরআনুল কারীম কোন মাসে প্রথম নাজিল হয়েছিল?',
        options: ['মহররম', 'রজব', 'রমজান', 'শাবান'],
        correctAnswer: 'রমজান',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_3',
        question: 'দৈনিক কত ওয়াক্ত নামাজ আদায় করা প্রত্যেক মুসলমানের উপর ফরজ?',
        options: ['৩ ওয়াক্ত', '৪ ওয়াক্ত', '৫ ওয়াক্ত', '৭ ওয়াক্ত'],
        correctAnswer: '৫ ওয়াক্ত',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_4',
        question: 'সর্বশেষ ও সর্বশ্রেষ্ঠ নবী ও রাসূল (সা.)-এর পবিত্র নাম কী?',
        options: ['হযরত ইব্রাহিম (আ.)', 'হযরত মুসা (আ.)', 'হযরত মুহাম্মদ (সা.)', 'হযরত ঈসা (আ.)'],
        correctAnswer: 'হযরত মুহাম্মদ (সা.)',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_5',
        question: 'পবিত্র কুরআনে মোট কতটি সূরা আছে?',
        options: ['১১০টি', '১১২টি', '১১৪টি', '১১৬টি'],
        correctAnswer: '১১৪টি',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_6',
        question: 'ইসলামের প্রথম খলিফা কে ছিলেন?',
        options: ['হযরত উমর (রা.)', 'হযরত আলী (রা.)', 'হযরত আবু বকর (রা.)', 'হযরত উসমান (রা.)'],
        correctAnswer: 'হযরত আবু বকর (রা.)',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_7',
        question: 'রমজান মাসে রোজা রাখা কার উপর ফরজ?',
        options: ['শুধু পুরুষদের উপর', 'শুধু ধনীদের উপর', 'প্রত্যেক সাবালক মুসলমানের উপর', 'শুধু আলেমদের উপর'],
        correctAnswer: 'প্রত্যেক সাবালক মুসলমানের উপর',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_8',
        question: 'ইসলামের প্রথম মসজিদের নাম কী?',
        options: ['মসজিদুল হারাম', 'মসজিদে নববী', 'মসজিদে কুবা', 'মসজিদুল আকসা'],
        correctAnswer: 'মসজিদে কুবা',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_9',
        question: 'হজ ফরজ হওয়ার শর্ত কোনটি?',
        options: ['শুধু শারীরিক সক্ষমতা', 'শুধু আর্থিক সামর্থ্য', 'শারীরিক ও আর্থিক উভয় সামর্থ্য', 'বয়স ৪০ বছর হওয়া'],
        correctAnswer: 'শারীরিক ও আর্থিক উভয় সামর্থ্য',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_10',
        question: 'পবিত্র কুরআনের সবচেয়ে বড় আয়াত কোনটি?',
        options: ['আয়াতুল কুরসী', 'আয়াতে মুদাইনাহ (বাকারা: ২৮২)', 'সূরা ফাতিহার শেষ আয়াত', 'সূরা ইখলাসের প্রথম আয়াত'],
        correctAnswer: 'আয়াতে মুদাইনাহ (বাকারা: ২৮২)',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_11',
        question: 'নবী মুহাম্মদ (সা.)-এর মাতার নাম কী?',
        options: ['হযরত খাদিজা (রা.)', 'হযরত আয়েশা (রা.)', 'হযরত আমিনা', 'হযরত ফাতেমা (রা.)'],
        correctAnswer: 'হযরত আমিনা',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_12',
        question: 'নামাজকে কী বলা হয়?',
        options: ['ইসলামের ভিত্তি', 'ইসলামের দ্বিতীয় স্তম্ভ', 'ইমানের খুঁটি', 'দ্বীনের মূল'],
        correctAnswer: 'ইমানের খুঁটি',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_13',
        question: 'সূরা ফাতিহাকে কোন বিশেষ নামে ডাকা হয়?',
        options: ['উম্মুল কুরআন', 'সূরাতুল বাকারা', 'আয়াতুল কুরসী', 'সূরাতুল ইখলাস'],
        correctAnswer: 'উম্মুল কুরআন',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_14',
        question: 'নামাজের আগে কী করা ফরজ?',
        options: ['গোসল', 'ওযু', 'তায়াম্মুম', 'মিসওয়াক করা'],
        correctAnswer: 'ওযু',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_15',
        question: 'হযরত মুহাম্মদ (সা.) কত বছর বয়সে নবুওয়াত লাভ করেন?',
        options: ['৩৫ বছর', '৪০ বছর', '৪৫ বছর', '৫০ বছর'],
        correctAnswer: '৪০ বছর',
        category: 'ইসলামিক সাধারণ জ্ঞান',
        marks: 1,
        isActive: true
      },
      {
        _id: 'iq_16',
        question: 'পিতা-মাতার সাথে কিরূপ ব্যবহার করতে আল্লাহ নির্দেশ দিয়েছেন?',
        options: ['উত্তম ও বিনম্র আচরণ', 'কঠোর আচরণ', 'সমান আচরণ', 'এড়িয়ে চলা'],
        correctAnswer: 'উত্তম ও বিনম্র আচরণ',
        category: 'ইসলামিক সাধারণ জ্ঞান',
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
      eventName: 'আল উয়ূন পরিষদ — বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)',
      eventDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
      eventVenue: 'হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম',
      perPersonFee: 1000,
      contactPerson: 'কাজী একেএম সাইফুদ্দিন মামুন',
      contactMobile: '+880 1819-173608',
      bankName: 'আল-আরাফাহ ইসলামী ব্যাংক লিমিটেড',
      bankBranch: 'মুরাদপুর শাখা, চট্টগ্রাম',
      bankAccountName: 'ALYOUN PORISHAD',
      bankAccountNumber: '1091120017273',
      bankAccountType: 'মুদারাবা সঞ্চয়ী হিসাব (MSD)',
      quizDate: '১২ ডিসেম্বর ২০২৬, শনিবার',
      quizOpeningTime: '11:00 AM',
      quizDurationMinutes: 20,
      isQuizEnabled: true,
      isQuizResultsPublished: false
    };
  }
}

module.exports = new DataStore();

# আল উয়ূন পরিষদ — বার্ষিক পারিবারিক মিলনমেলা–২০২৬
## ইভেন্ট ওয়েবসাইট ও অ্যাডমিন ম্যানেজমেন্ট সিস্টেম

একটি সম্পূর্ণ রেসপনসিভ, ইসলামিক মার্জিত ডিজাইনের একক-ইভেন্ট ওয়েব প্ল্যাটফর্ম।

---

### মূল ফিচারসমূহ:
- **ইসলামিক মার্জিত ডিজাইন:** Emerald Green, Gold ও White থিম এবং Hind Siliguri বাংলা ফন্ট।
- **লাইভ কাউন্টডাউন টাইমার:** ১২ ডিসেম্বর ২০২৬ সকাল ১০:০০টা পর্যন্ত কাউন্টডাউন।
- **ভেন্যু:** হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম।
- **পারিবারিক রেজিস্ট্রেশন ও স্বয়ংক্রিয় শুভেচ্ছা ফি গণনা:**
  - জনপ্রতি ১,০০০ টাকা হারে হিসাব (মূল বন্ধু + পরিবারের প্রতিটি সদস্য)।
  - কামিল নির্বাচন করলে শর্তাধীন বিষয় নির্বাচন (আদব, ফিকহ, তাফসির, হাদিস)।
  - অনন্য রেজিস্ট্রেশন নম্বর তৈরি (যেমন: `AUP-2026-1001`)।
- **গোপনীয়তা রক্ষা:**
  - পাবলিক রেজিস্ট্রেশন স্ট্যাটাস পেজ ও কুইজ রেজাল্টে মোবাইল নম্বর, ইমেইল, ঠিকানা বা পরিবারের সদস্যদের ব্যক্তিগত তথ্য সম্পূর্ণ অপ্রকাশিত।
- **শিশুদের বিশেষ কুইজ প্রতিযোগিতা (ভেন্যুভিত্তিক):**
  - বাবার নিবন্ধিত মোবাইল নম্বর ও সন্তানের নাম দিয়ে অংশগ্রহণকারী যাচাই।
  - সার্ভার-নিয়ন্ত্রিত ২০ মিনিটের টাইমার ও একক প্রচেষ্টা (One-attempt)।
  - ব্যাকএন্ডে স্বয়ংক্রিয় স্কোরিং ও সময়ভিত্তিক মেধা তালিকা।
  - ফলাফল প্রকাশ ও অভিভাবকদের ফলাফল ইমেইল নোটিফিকেশন।
- **নিরাপদ অ্যাডমিন ড্যাশবোর্ড:**
  - Firebase Authentication + Firebase Admin SDK টোকেন ভেরিফিকেশন ও অনুমোদিত অ্যাডমিন তালিকা (`ADMIN_EMAILS`)।
  - রেজিস্ট্রেশন পরিচালনা, ফিল্টারিং, সার্চ ও CSV এক্সপোর্ট।
  - বিকাশ / ব্যাংক পেমেন্ট যাচাইকরণ ও স্বয়ংক্রিয় কনফার্মেশন ইমেইল প্রেরণ।
  - কুইজ প্রশ্নব্যাংক, সময় নির্ধারণ ও ফলাফল প্রকাশ।
  - ইভেন্ট ফটো গ্যালারি ও সেটিংস ব্যবস্থাপনা।

---

### প্রযুক্তিগত স্ট্যাক (Technology Stack):
- **Frontend:** React (Vite), Tailwind CSS, DaisyUI, React Router DOM, Axios, Lucide React Icons
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose ODM)
- **Authentication & Storage:** Firebase Authentication, Firebase Admin SDK, Firebase Storage
- **Email Service:** Nodemailer (SMTP)

---

### লোকাল ডেভেলপমেন্ট ও রান করার নির্দেশিকা:

#### ১. সার্ভার চালু করতে:
```bash
cd server
npm.cmd install
npm.cmd start
# অথবা ডেভেলপমেন্ট ওয়াচ মোডে: npm.cmd run dev
```
সার্ভার চালু হবে: `http://localhost:5000`

#### ২. ক্লায়েন্ট চালু করতে:
```bash
cd client
npm.cmd install
npm.cmd run dev
```
ওয়েবসাইট ভিজিট করুন: `http://localhost:5173`

#### ৩. স্বয়ংক্রিয় এন্ড-টু-এন্ড টেস্ট রান করতে:
```bash
cd server
node test-api.js
```

---

### ডিপ্লয়মেন্ট গাইড (Deployment Guide - Phase 10):

#### ক. ক্লায়েন্ট ডিপ্লয়মেন্ট (Vercel / Firebase Hosting / Netlify):
1. `client/.env` ফাইলে প্রোডাকশন এপিআই ও ফায়ারবেস ভেরিয়েবল সেট করুন:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   ```
2. বিল্ড কমান্ড রান করুন: `npm run build`
3. তৈরি হওয়া `client/dist` ফোল্ডারটি হোস্টিংয়ে ডিপ্লয় করুন।

#### খ. ব্যাকএন্ড ডিপ্লয়মেন্ট (Render / Railway / DigitalOcean / VPS):
1. পরিবেশ ভেরিয়েবল কনফিগার করুন (`.env`):
   ```
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.com
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/al_uyun_parishad_2026?retryWrites=true&w=majority
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   EMAIL_FROM="আল উয়ূন পরিষদ <your-email@gmail.com>"
   ADMIN_EMAILS=admin@aluyun.org,mamun@aluyun.org
   ```
2. সার্ভার স্টার্ট কমান্ড: `node server.js`
3. রিভার্স প্রক্সি হিসেবে Nginx ও SSL (Certbot) কনফিগার করুন।

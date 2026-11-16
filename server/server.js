require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (if configured)
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'https://al-uyun-parishad-2026.web.app',
  'https://al-uyun-parishad-2026.firebaseapp.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for registration & quiz public endpoints to prevent spam
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // limit each IP to 120 requests per window
  message: {
    success: false,
    message: 'অতিরিক্ত অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'
  }
});

// Fix Vercel rewrites: if Vercel sets req.url to /server.js, restore from x-matched-path
app.use((req, res, next) => {
  const matched = req.headers['x-matched-path'];
  if (matched && (req.url === '/server.js' || req.url === '/server' || req.url.startsWith('/server.js'))) {
    req.url = matched;
  }
  next();
});

// Health check
app.get(['/', '/health', '/api', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'আল উয়ূন পরিষদ ২০২৬ সার্ভার সচল রয়েছে',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api', publicLimiter, publicRoutes);
app.use('/api/admin', adminRoutes);

// Fallback direct mounts
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'অনুরোধকৃত এপিআই রুটটি পাওয়া যায়নি'
  });
});

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB, getDBStatus } = require('./config/db');

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

// Ensure MongoDB connection before handling requests (crucial for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('DB connect middleware error:', e.message);
  }
  next();
});

// Health check
app.get(['/', '/health', '/api', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'আল উয়ূন পরিষদ ২০২৬ সার্ভার সচল রয়েছে',
    dbConnected: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes on /api (more specific /api/admin must be mounted first)
app.use('/api/admin', adminRoutes);
app.use('/api', publicLimiter, publicRoutes);

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

const admin = require('../config/firebaseAdmin');

const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্টে লগইন করুন।'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    // Authorized admin email allowlist
    const allowlistEnv = process.env.ADMIN_EMAILS || 'admin@aluyun.org,mamun@aluyun.org';
    const allowedEmails = allowlistEnv.split(',').map(e => e.trim().toLowerCase());

    // Try real Firebase Admin verification if initialized
    if (admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = decodedToken.email?.toLowerCase();

        if (!allowedEmails.includes(email)) {
          return res.status(403).json({
            success: false,
            message: 'আপনার ইমেইলটি অ্যাডমিন হিসেবে অনুমোদিত নয়।'
          });
        }

        req.admin = decodedToken;
        return next();
      } catch (fbErr) {
        // If not a valid Firebase ID token and in dev mode with mock token
        if (process.env.NODE_ENV !== 'production' && token === 'demo-admin-token') {
          req.admin = { email: 'admin@aluyun.org', uid: 'demo-admin-uid' };
          return next();
        }
        return res.status(401).json({
          success: false,
          message: 'টোকেন মেয়াদোত্তীর্ণ বা অবৈধ। আবার লগইন করুন।'
        });
      }
    } else {
      // Dev mode fallback token verification
      if (token === 'demo-admin-token' || token.length > 20) {
        req.admin = { email: 'admin@aluyun.org', uid: 'demo-admin-uid' };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'অবৈধ অথেনটিকেশন টোকেন।'
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'অথেনটিকেশন প্রক্রিয়ায় সমস্যা হয়েছে: ' + error.message
    });
  }
};

module.exports = { verifyAdminToken };

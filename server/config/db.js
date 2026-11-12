const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI এনভায়রনমেন্ট ভেরিয়েবলে পাওয়া যায়নি। মেমোরি মোডে কাজ করবে।');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas সফলভাবে সংযুক্ত: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB কানেকশন ত্রুটি: ${error.message}`);
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };

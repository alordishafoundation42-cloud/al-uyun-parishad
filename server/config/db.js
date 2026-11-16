const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb://alordisha_xyz:alordisha_xyz@ac-p7zq2ke-shard-00-00.wfnasx3.mongodb.net:27017,ac-p7zq2ke-shard-00-01.wfnasx3.mongodb.net:27017,ac-p7zq2ke-shard-00-02.wfnasx3.mongodb.net:27017/al_uyun_parishad_2026?ssl=true&replicaSet=atlas-xsl2s8-shard-0&authSource=admin&appName=Cluster0';

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  if (mongoose.connection.readyState === 2) {
    // Already connecting, await existing promise
    if (cachedPromise) {
      await cachedPromise;
      return mongoose.connection.readyState === 1;
    }
  }

  try {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false, // Fail fast rather than hang in serverless
    });
    const conn = await cachedPromise;
    console.log(`✅ MongoDB Atlas সফলভাবে সংযুক্ত: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB কানেকশন ত্রুটি: ${error.message}`);
    cachedPromise = null;
    return false;
  }
};

const getDBStatus = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, getDBStatus };

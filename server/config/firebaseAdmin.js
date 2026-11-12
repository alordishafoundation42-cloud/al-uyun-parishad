const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let firebaseApp = null;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || path.join(__dirname, 'firebaseServiceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin SDK ইনিশিয়ালাইজ সম্পন্ন (Service Account ফাইল থেকে)');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin SDK ইনিশিয়ালাইজ সম্পন্ন (ENV ভেরিয়েবল থেকে)');
  } else {
    console.warn('⚠️ Firebase Service Account কনফিগার করা হয়নি। অ্যাডমিন প্রটেকশন ডেভেলপমেন্ট মোডে সক্রিয় থাকবে।');
  }
} catch (error) {
  console.warn(`⚠️ Firebase Admin ইনিশিয়ালাইজ সতর্কতা: ${error.message}`);
}

module.exports = admin;

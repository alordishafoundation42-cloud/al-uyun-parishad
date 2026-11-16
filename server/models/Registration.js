const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, enum: ['পুরুষ', 'মহিলা', 'অন্যান্য'], required: true },
  relationship: { type: String, enum: ['স্ত্রী', 'স্ত্রী/স্বামী', 'ছেলে', 'মেয়ে', 'অন্যান্য'], required: true }
}, { _id: true });

const registrationSchema = new mongoose.Schema({
  registrationNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    index: true 
  },
  friendName: { type: String, required: true, trim: true },
  mobile: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true,
    index: true 
  },
  profession: { type: String, required: true, trim: true },
  highestDegree: { 
    type: String, 
    enum: ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', 'স্নাতক', 'স্নাতকোত্তর', 'এমফিল', 'পিএইচডি', 'অন্যান্য'],
    required: true 
  },
  kamilSubject: { 
    type: String, 
    enum: ['আদব', 'ফিকহ', 'তাফসির', 'হাদিস', null],
    default: null 
  },
  presentAddress: { type: String, required: true, trim: true },
  permanentAddress: { type: String, required: true, trim: true },
  familyMembers: [familyMemberSchema],
  participantCount: { type: Number, required: true, min: 1 },
  totalFee: { type: Number, required: true, min: 1000 },
  paymentMethod: { type: String, required: true, trim: true },
  cashReceiver: { type: String, trim: true, default: '' },
  transactionId: { type: String, trim: true, default: '' },
  paymentDate: { type: Date, required: true },
  senderMobile: { type: String, trim: true, default: '' },
  receiptUrl: { type: String, default: null },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending',
    index: true 
  },
  registrationStatus: { 
    type: String, 
    enum: ['অপেক্ষমাণ', 'নিশ্চিত', 'বাতিল'], 
    default: 'অপেক্ষমাণ' 
  },
  adminNote: { type: String, default: '' },
  paymentVerifiedAt: { type: Date, default: null },
  confirmationEmailStatus: { 
    type: String, 
    enum: ['Not Sent', 'Sent', 'Failed'], 
    default: 'Not Sent' 
  },
  emailDeliveryLog: [{
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed'] },
    error: { type: String, default: null }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);

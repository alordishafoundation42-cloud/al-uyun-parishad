const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true, trim: true },
  caption: { type: String, default: '', trim: true },
  category: { type: String, default: 'মিলনমেলা স্মৃতি', trim: true },
  isPublished: { type: Boolean, default: true, index: true },
  uploadedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);

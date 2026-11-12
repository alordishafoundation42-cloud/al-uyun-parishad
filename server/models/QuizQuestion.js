const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  category: { type: String, default: 'সাধারণ জ্ঞান' },
  options: [{ type: String, required: true, trim: true }],
  correctAnswer: { type: String, required: true, trim: true },
  marks: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['সহজ', 'মাঝারি', 'কঠিন'], default: 'সহজ' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);

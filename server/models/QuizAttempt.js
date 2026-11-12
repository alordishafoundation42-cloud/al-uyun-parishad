const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOption: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  marksObtained: { type: Number, default: 0 }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  registrationId: { 
    type: mongoose.Schema.Types.Mixed, 
    ref: 'Registration', 
    required: true,
    index: true 
  },
  childName: { type: String, required: true, trim: true },
  childIdentifier: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // Format: `${mobile.toLowerCase()}_${childName.toLowerCase().replace(/\s+/g, '')}`
  startedAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true }, // Exactly startedAt + 20 minutes (1200 seconds)
  submittedAt: { type: Date, default: null },
  answers: [quizAnswerSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  completionTime: { type: Number, default: 0 }, // Completion duration in seconds
  attemptStatus: { 
    type: String, 
    enum: ['InProgress', 'Completed', 'Expired'], 
    default: 'InProgress' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);

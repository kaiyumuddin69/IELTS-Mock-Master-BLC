import mongoose from 'mongoose';

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  batchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Batch' 
  },
  createdAt: { type: Date, default: Date.now }
});

// --- Batch Model ---
const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  assignedTests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test' 
  }],
  createdAt: { type: Date, default: Date.now }
});

// --- Test Model ---
const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['mcq', 'fill-in-the-blanks', 'matching', 'tfng'], 
    required: true 
  },
  question: String, // For MCQs, TFNG
  text: String, // For Fill-in-the-blanks, Matching
  options: [String], // For MCQs, Matching
  correctAnswer: mongoose.Schema.Types.Mixed,
});

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  instruction: String,
  content: String, // Passage text or Audio URL
  questions: [questionSchema]
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  module: { 
    type: String, 
    enum: ['reading', 'listening', 'writing', 'speaking'], 
    required: true 
  },
  duration: { type: Number, required: true }, // in minutes
  sections: [sectionSchema],
  // For Writing specific fields
  task1Prompt: String,
  task2Prompt: String,
  task1Image: String,
  createdAt: { type: Date, default: Date.now }
});

// --- Result Model ---
const resultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  testId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: true 
  },
  module: String,
  answers: mongoose.Schema.Types.Mixed,
  score: Number,
  total: Number,
  band: Number,
  feedback: String, // Admin feedback
  status: { 
    type: String, 
    enum: ['completed', 'pending', 'marked'], 
    default: 'completed' 
  },
  timestamp: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Batch = mongoose.model('Batch', batchSchema);
export const Test = mongoose.model('Test', testSchema);
export const Result = mongoose.model('Result', resultSchema);

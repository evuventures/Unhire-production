import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'expert', 'admin'], default: 'client' },

  // --- NEW FIELDS FOR EXPERTS ---
  skills: {
    type: [String],
    default: [], // e.g. ["Node.js", "React", "MongoDB"]
  },
  expertStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'none'],
    default: 'none' // 'none' means they haven't applied yet. 'pending' means applied.
  },
  expertProfile: {
    portfolio: String,
    github: String,
    linkedin: String,
    resume: String, // URL to resume file
  },
  rating: {
    type: Number,
    default: 0, // 0–5 scale based on client feedback
  },
  totalProjects: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: "",
  },
  verificationCode: String,
  verificationCodeExpire: Date,
},
  { timestamps: true }
);


// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate and hash verification code
userSchema.methods.getVerificationCode = function () {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash and set to verificationCode field
  this.verificationCode = crypto.createHash('sha256').update(code).digest('hex');

  // Set expire time (10 minutes)
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return code; // Return unhashed code to send via email
};

// Verify entered code
userSchema.methods.verifyCode = function (enteredCode) {
  const hashedCode = crypto.createHash('sha256').update(enteredCode).digest('hex');
  return this.verificationCode === hashedCode && this.verificationCodeExpire > Date.now();
};

export default mongoose.model('User', userSchema);

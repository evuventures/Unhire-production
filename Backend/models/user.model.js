import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['client', 'expert', 'admin'], default: 'client' },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String },

  // --- EXPERT FIELDS ---
  skills: {
    type: [String],
    default: [], // e.g. ["Node.js", "React", "MongoDB"]
  },
  linkedIn: {
    type: String,
    default: "",
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
},
  { timestamps: true }
);


// Hash password
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);

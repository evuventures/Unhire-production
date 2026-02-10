import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'expert', 'admin'], default: 'client' },

  // --- NEW FIELDS FOR EXPERTS ---
  skills: {
    type: [String],
    default: [], // e.g. ["Node.js", "React", "MongoDB"]
    required: true, // e.g. ["Node.js", "React", "MongoDB"]
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
  linkedin: {
    type: String,
    default: ""
  },
  resume: {
    type: String, // Store file path
    default: ""
  },
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

export default mongoose.model('User', userSchema);

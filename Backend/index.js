import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { startProjectMonitor } from "./cron/projectMonitor.js";
import projectRoutes from "./routes/project.routes.js";


dotenv.config();
const app = express();

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173", // React dev server
  "https://your-frontend-domain.vercel.app" // production frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies/auth headers
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
    startProjectMonitor();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/projects", projectRoutes);




app.get('/', (req, res) => res.send('Server is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

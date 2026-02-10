import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import projectRoutes from "./routes/project.routes.js";
import expertRoutes from "./routes/expert.routes.js";
import utilsRoutes from "./routes/utils.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { startProjectMonitor } from "./cron/projectMonitor.js";
import { verifyTransporter } from "./services/email.service.js";


dotenv.config();
const app = express();

// ---------- CORS ----------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    "http://localhost:5173", // React dev server default
  ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies/auth headers
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    startProjectMonitor();
    await verifyTransporter();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expert", expertRoutes);
app.use('/api/utils', utilsRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/notifications", notificationRoutes);




app.get('/', (req, res) => res.send('Server is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

//import authRoutes from './routes/auth.routes.js';
//import profileRoutes from './routes/profile.routes.js';
//import adminRoutes from './routes/admin.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Server is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

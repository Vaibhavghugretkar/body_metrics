import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import measurementRoutes from './routes/measurementRoutes.js'
// import { errorHandler } from './utils/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/measurements', measurementRoutes)
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

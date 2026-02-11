import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './netlify/functions/routes/itemRoutes';
import settingsRoutes from './netlify/functions/routes/settingsRoutes';
import offerRoutes from './netlify/functions/routes/offerRoutes';
import categoryRoutes from './netlify/functions/routes/categoryRoutes';
import authRoutes from './netlify/functions/routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
// Emulate Netlify function paths locally
app.use('/.netlify/functions/api/items', itemRoutes);
app.use('/.netlify/functions/api/settings', settingsRoutes);
app.use('/.netlify/functions/api/offers', offerRoutes);
app.use('/.netlify/functions/api/categories', categoryRoutes);
app.use('/.netlify/functions/api/auth', authRoutes);

// Database
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error(err));

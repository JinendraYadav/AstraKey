import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';
import './config/passport.js'; // ✅ make sure this path is correct
import authRoutes from './routes/authRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';

dotenv.config();

const app = express();
app.use(cookieParser());

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// ✅ Add express-session before passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: 'taskmanager',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true on Vercel/Render
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session()); // if using persistent login

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes); // protect these later

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((err) => console.error("MongoDB connection error:", err));

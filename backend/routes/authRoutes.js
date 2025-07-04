import express from 'express';
import passport from 'passport';
import {
    signup,
    login,
    logout,
    getMe,
    setUsername,
    handleGoogleOAuth,
} from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// 🔐 Standard Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);
router.post('/set-username', verifyToken, setUsername); // 🔐 Protected endpoint

// ✅ Verify token route (optional, useful for debugging auth)
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});


// 🌐 Google OAuth Routes
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login', // or your frontend login page
    }),
    handleGoogleOAuth
);

// ✅ Export default for clean import
export default router;

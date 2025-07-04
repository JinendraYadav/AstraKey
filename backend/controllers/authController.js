import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔐 Generate JWT
const generateJWT = (userId, username) => {
    return jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// 📝 Send JWT as HttpOnly Cookie
const sendToken = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// 🧾 Signup
export const signup = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
        return res.status(409).json({ message: "Email or username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });

    const token = generateJWT(user._id, user.username);
    sendToken(res, token);

    res.status(201).json({
        message: "Signup successful",
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
        },
    });
};

// 🔑 Login
export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: username }, { username }],
    });

    if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid email/username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateJWT(user._id, user.username);
    sendToken(res, token);

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
        },
        token, // optional for frontend use
    });
};

// 🚪 Logout
export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
};

// 👤 Get current logged-in user
export const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        console.error("Error in getMe:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// 🌐 Google OAuth Callback
export const handleGoogleOAuth = async (req, res) => {
    try {
        const { email } = req.user;
        const baseUsername = email.split("@")[0];

        let user = await User.findOne({ email });

        if (!user) {
            const usernameExists = await User.findOne({ username: baseUsername });

            if (usernameExists) {
                return res.redirect(`${process.env.CLIENT_URL}/choose-username?email=${email}`);
            }

            user = await User.create({ email, username: baseUsername });
        }

        const token = generateJWT(user._id, user.username);
        sendToken(res, token);

        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } catch (err) {
        console.error("Google OAuth error:", err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
};

// 🧑‍🎓 Set or Update Username (for Google logins)
export const setUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user?.id;

        if (!username || !userId) {
            return res.status(400).json({ message: "Username and authentication required" });
        }

        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(409).json({ message: "Username already taken" });
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        );

        res.status(200).json({
            message: "Username updated",
            username: updated.username,
        });
    } catch (err) {
        console.error("Error updating username:", err);
        res.status(500).json({ message: "Server error" });
    }
};

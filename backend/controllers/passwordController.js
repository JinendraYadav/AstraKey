// controllers/passwordController.js
import Password from "../models/Passwords.js";
import { encrypt, decrypt } from "../utils/crypto.js";

// 🔐 Get all passwords for logged-in user
export const getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ ownerUsername: req.user.username }); // ✅ username-based filtering
        const decryptedPasswords = passwords.map((doc) => ({
            id: doc._id,
            site: doc.site,
            username: doc.username,
            password: decrypt(doc.password),
        }));
        res.status(200).json(decryptedPasswords);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ➕ Add new password entry (requires user to be authenticated)
export const addPassword = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.username || !user.id) {
            return res.status(401).json({ message: "Unauthorized access. Please login." });
        }

        const { site, username, password } = req.body;

        if (!site || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const encryptedPassword = encrypt(password);

        const newPassword = new Password({
            site,
            username,
            password: encryptedPassword,
            ownerUsername: user.username,
            createdBy: user.id,
        });

        await newPassword.save();

        res.status(201).json({
            id: newPassword._id,
            site: newPassword.site,
            username: newPassword.username,
            password, // Send plain password for frontend to show immediately
        });
    } catch (err) {
        console.error("❌ Error saving password:", err);
        res.status(500).json({ message: "Failed to save password" });
    }
};


// ✏️ Update a password (only if it belongs to logged-in user)
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { site, username, password } = req.body;
        const encrypted = encrypt(password);

        const updated = await Password.findOneAndUpdate(
            { _id: id, ownerUsername: req.user.username }, // ✅ username-based match
            { site, username, password: encrypted },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Password not found" });
        }

        res.json({
            id: updated._id,
            site: updated.site,
            username: updated.username,
            password,
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ❌ Delete a password (only if it belongs to logged-in user)
export const deletePassword = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Password.findOneAndDelete({
            _id: id,
            ownerUsername: req.user.username, // ✅ prevents others from deleting
        });

        if (!deleted) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

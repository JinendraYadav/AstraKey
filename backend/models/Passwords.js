// models/Passwords.js
import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
    {
        site: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }, // encrypted manually
        ownerUsername: { type: String, required: true }, // ✅ replaces userId
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

    },
    { timestamps: true }
);

export default mongoose.model("Password", passwordSchema);

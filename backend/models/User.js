// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google OAuth users
});

export default mongoose.model("User", userSchema);

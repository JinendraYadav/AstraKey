import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const username = email.split("@")[0]; // 👈 extract before @

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        username,
                        avatar: profile.photos[0].value,
                        provider: "google",
                    });
                }

                const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET);
                user.token = token;
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
        
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default verifyToken;

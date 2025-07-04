import express from "express";
import {
    addPassword,
    getPasswords,
    deletePassword,
    updatePassword,
} from "../controllers/passwordController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ All routes protected
router.use(verifyToken);

// ✅ These now match frontend expectations
router.get("/", getPasswords);          // GET    /api/passwords
router.post("/", addPassword);          // POST   /api/passwords ✅ FIXED HERE
router.put("/:id", updatePassword);     // PUT    /api/passwords/:id
router.delete("/:id", deletePassword);  // DELETE /api/passwords/:id

export default router;

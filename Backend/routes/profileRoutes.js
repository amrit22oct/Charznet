import express from "express";
import { getProfile, updateProfile } from "../Controllers/profileController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);

export default router;

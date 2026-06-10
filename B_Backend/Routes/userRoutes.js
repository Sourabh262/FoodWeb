import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

export default router;

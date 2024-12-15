import express, { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";

const router: Router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);

router.get("/check", protectedRoute, checkAuth);

export default router;
import express, { Router } from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", updateProfile)

export default router;
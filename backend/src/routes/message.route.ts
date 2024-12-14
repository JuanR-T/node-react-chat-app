import express, { Router } from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller";
import { protectedRoute } from "../middleware/protectedRoute.middleware";

const router: Router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
export default router;
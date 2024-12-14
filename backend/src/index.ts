import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.route";

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());

app.listen(PORT, () => {
    console.log("server is running on port: " + PORT);
    connectDB();
});
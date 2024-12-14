import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI!;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in the environment variables");
        }

        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error", error);
    }
};
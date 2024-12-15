import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute: any = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Unauthorized, no token provided"})
        }
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const decoded:any = jwt.verify(token, jwtSecret);

        if (!decoded) {
            return res.status(401).json({message: "Unauthorized, invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;

        next();
    } catch (error: unknown) {
        console.error("Error in protectedRoute middleware", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ userId }, jwtSecret, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};
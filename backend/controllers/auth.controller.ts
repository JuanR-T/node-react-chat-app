import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateToken } from "../lib/utils";
import User from "../models/user.model";


export const signup: any = async (req: Request, res: Response) => {
    const {fullName, email, password} = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email});
        if (user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id.toString(), res)

            res.status(201).json({
                _id: newUser._id.toString(),
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error: unknown) {
        console.error("Error in signup controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const login = (req: Request, res: Response) => {
    res.send("login route");
}
export const logout = (req: Request, res: Response) => {
    res.send("logout route");
}
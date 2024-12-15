import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";


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
            generateToken(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
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
export const login: any = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id, 
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture
        })
    } catch (error: unknown) {
        console.error("Error in login controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const logout: any = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error: unknown) {
        console.error("Error in logout controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile: any = async (req: any, res: Response) => {
    try {
        const {profilePicture} = req.body;
        const userId = req.user._id;

        if (!profilePicture) {
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);
    } catch (error: unknown) {
        console.error("Error in update controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const checkAuth: any = (req: any, res: Response) => {
    try {
        res.status(200).json(req.user);
    } catch (error: unknown) {
        console.error("Error in checkAuth controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
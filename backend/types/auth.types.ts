import { NextFunction, Request, Response } from "express";

export interface SignupRequestBody {
    fullName: string;
    email: string;
    password: string;
}

export interface UserDocument extends Document {
    fullName: string;
    email: string;
    password: string;
    profilePicture?: string;
    _id: string;
}

// Controller function type
export type SignupController = (
    req: Request<{}, {}, SignupRequestBody>, 
    res: Response, 
    next: NextFunction
) => Promise<void>;
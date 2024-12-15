import { Response } from "express";
import cloudinary from "../lib/cloudinary";
import { getReceiverSocketId, io } from "../lib/socket";
import Message from "../models/message.model";
import User from "../models/user.model";

export const getUsersForSidebar = async (req: any, res: Response) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}); //$ne excludes loggedInUser from the res
        res.status(200).json(filteredUsers);
    }  catch (error: unknown) {
        console.error("Error in getUsersForSidebar controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const getMessages = async (req: any, res: Response) => {
    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}
            ]
        })
        res.status(200).json(messages);

    } catch (error: unknown) {
        console.error("Error in getMessages controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const sendMessage = async (req: any, res: Response) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);

    } catch (error: unknown) {
        console.error("Error in sendMessage controller", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: "Internal Server Error"});
    }
}
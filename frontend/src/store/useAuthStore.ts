import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001": "/";

export const useAuthStore: any = create ((set: any, get: any) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },
    signup: async (data: any) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp: false});
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data: any) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Signed in successfully");
            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn: false});
        }
    },
    updateProfile: async (data: any) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile picture changed successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({socket: socket});

        socket.on("getOnlineUsers", (userIds: any) => {
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const useChatStore: any = create((set: any, get: any) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error: any) {
            toast.error(error.response.data.message)
            
        } finally {
            set({isUserLoading: false});
        }
    },
    getMessages: async (userId: any) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error: any) {
            toast.error(error.response.data.message)
            
        } finally {
            set({isMessagesLoading: false});
        }
    },
    sendMessage: async (messageData: any) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        //This retrieves the socket state from another store
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage: any) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },
    unsubscribeFromMessages: () => {
        //This retrieves the socket state from another store
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser: any) => set({selectedUser}),
}));

export default useChatStore;
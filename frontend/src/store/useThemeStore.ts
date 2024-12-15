import { create } from "zustand";


export const useThemeStore: any = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "forest",
    setTheme: (theme: any) => {
        localStorage.setItem("chat-theme", theme);
        set({theme});
    }
}));

export default useThemeStore
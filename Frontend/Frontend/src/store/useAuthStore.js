import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogginIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            console.log("✅ Response from /auth/check:", res.data);
            set({ authUser: res.data });
        } catch (error) {
            console.error("❌ Error in checkAuth:", error.response?.data || error.message);
            set({ authUser: null })

        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async () => {

    }
})) 
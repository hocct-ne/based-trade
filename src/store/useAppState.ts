import { create } from "zustand";

interface UserState {
  isConnected: boolean;

  setIsConnected: (setIsConnected: boolean) => void;
}

export const useAppState = create<UserState>((set, get) => ({
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
}));

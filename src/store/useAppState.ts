import { create } from "zustand";

interface Ticker {
  symbol: string;
  price: number;
  change24hPercent: number;
  fundingRate?: number;
  volume?: number;
}

interface UserState {
  isConnected: boolean;

  setIsConnected: (setIsConnected: boolean) => void;
}

export const useAppState = create<UserState>((set, get) => ({
  isConnected: false,

  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
}));

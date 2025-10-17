import { create } from "zustand";

interface TradeState {
  availableFunds: number;
  currentPosition: number;
  markPrice: number;
  setAvailableFunds: (v: number) => void;
  setMarkPrice: (v: number) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  availableFunds: 1000,
  currentPosition: 0,
  markPrice: 0,
  setAvailableFunds: (v) => set({ availableFunds: v }),
  setMarkPrice: (v) => set({ markPrice: v }),
}));

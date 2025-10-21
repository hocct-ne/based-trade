import { AllMids } from "@coin98-hyper/core";
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
  tickers: Record<string, Ticker>;

  setIsConnected: (setIsConnected: boolean) => void;
  updateTickers: (mids: AllMids) => void;
}

export const useAppState = create<UserState>((set, get) => ({
  isConnected: false,
  tickers: {},

  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
  updateTickers: (mids) => {
    console.log("mids", mids);

    const updated: Record<string, Ticker> = {};
    Object.entries(mids).forEach(([symbol, data]: any) => {
      updated[symbol] = {
        symbol,
        price: Number(data.markPx),
        change24hPercent: data.change24h * 100,
        fundingRate: data.fundingRate,
        volume: data.volume,
      };
    });
    set({ tickers: updated });
  },
}));

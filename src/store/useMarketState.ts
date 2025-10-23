import { ActiveAssetDataState } from "@coin98-hyper/core";
import { create } from "zustand";

export interface Market {
  symbol: string;
  markPx: string;
  oraclePx: string;
  volume24h?: number;
  change24h?: number;
  change24hValue?: number;
  type?: "SPOT" | "PERP";
  marketCap?: number;
  funding?: number;
}

interface MarketState {
  markets: Market[];
  activeAssetData: Record<string, Record<string, ActiveAssetDataState>>;

  setMarkets: (m: Market[]) => void;
  updateMarkPrices: (mids: Record<string, string>) => void;
  setActiveAssetData: (
    address: string,
    symbol: string,
    data: ActiveAssetDataState
  ) => void;
}

export const useMarketState = create<MarketState>((set, get) => ({
  markets: [],
  activeAssetData: {},

  setMarkets: (m) => set({ markets: m }),
  updateMarkPrices: (mids) => {
    const prev = get().markets;
    const updated = prev.map((m) => ({
      ...m,
      markPx: mids[m.symbol],
    }));
    set({ markets: updated });
  },
  setActiveAssetData: (address, symbol, data) =>
    set((state) => ({
      activeAssetData: {
        ...state.activeAssetData,
        [address]: {
          ...state.activeAssetData[address],
          [symbol]: data,
        },
      },
    })),
}));

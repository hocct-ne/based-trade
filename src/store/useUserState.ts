import { create } from "zustand";

interface UserState {
  accountValue: number;
  availableFunds: number;
  positions: any[];
  balances: any[];
  updateFromFeed: (data: any) => void;
  setAvailableFunds: (v: number) => void;
  getPositionSize: (symbol: string) => number;
}

export const useUserState = create<UserState>((set, get) => ({
  accountValue: 0,
  availableFunds: 0,
  positions: [],
  balances: [],
  updateFromFeed: (data) => {
    const clearing = data.clearinghouseState ?? {};
    const spot = data.spotState ?? {};
    set({
      accountValue: clearing.marginSummary?.accountValue ?? 0,
      availableFunds: clearing.withdrawable ?? 0,
      positions: clearing.assetPositions ?? [],
      balances: spot.balances ?? [],
    });
  },
  setAvailableFunds: (v) => set({ availableFunds: v }),
  getPositionSize: (symbol: string) => {
    const positions = get().positions;
    const pos = positions.find(
      (p) => p.position?.coin.split("-")[0] === symbol
    );
    return pos?.position?.szi ?? 0;
  },
}));

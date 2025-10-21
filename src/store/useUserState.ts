import { AllMids } from "@coin98-hyper/core";
import { create } from "zustand";

interface Position {
  type: string;
  position: {
    coin: string;
    szi: number;
    leverage: {
      type: string;
      value: number;
      rawUsd: number;
    };
    cumFunding: any;
    entryPx: number;
    positionValue: number;
    unrealizedPnl: number;
    returnOnEquity: number;
    liquidationPx: number;
    marginUsed: number;
    maxLeverage: number;
  };
}

interface Balance {
  coin: string;
  total: number;
  hold?: number;
  entryNtl?: number;
  type?: string;
  marginUsed?: number;
  unrealizedPnl?: number;
}

interface Order {
  time: string;
  type: string;
  coin: string;
  direction: "Buy" | "Sell";
  size: number;
  originalSize: number;
  orderValue: number;
  price: number;
  reduceOnly?: boolean;
  trigger?: string;
}

interface UserState {
  accountValue: number;
  availableFunds: number;
  positions: Position[];
  balances: Balance[];
  allBalances: any[];
  markPrices: AllMids;
  openOrders: Order[];

  updateFromFeed: (data: any) => void;
  setAvailableFundsVsPositions: ({
    available,
    positions,
  }: {
    available: number;
    positions: any;
  }) => void;
  getPositionSize: (symbol: string) => number;
  getBalance: (coin: string) => Balance | undefined;
  updateMarkPrices: (mids: AllMids) => void;
  updateOrder: (orders: Order[]) => void;
  // cancelOrder: (id: string) => void;
}

export const useUserState = create<UserState>((set, get) => ({
  accountValue: 0,
  availableFunds: 0,
  positions: [],
  balances: [],
  allBalances: [],
  markPrices: {},
  openOrders: [],

  updateFromFeed: (data) => {
    const clearing = data.clearinghouseState ?? {};
    const spot = data.spotState ?? {};

    const perpBalances = {
      coin: `USDC (Perps)`,
      type: "PERP",
      total: clearing.marginSummary.accountValue.toFixed(2),
      availableBalance: (
        clearing.marginSummary.accountValue -
        clearing.marginSummary.totalMarginUsed
      ).toFixed(2),
      usdcValue: `$${clearing.marginSummary.accountValue.toFixed(2)}`,
      unit: "USDC",
    };

    const spotBalances =
      spot.balances?.map((b: any) => ({
        coin: b.coin === "USDC" ? `${b.coin} (Spot)` : b.coin,
        type: "SPOT",
        total: b.total.toFixed(8),
        availableBalance: (b.total - b.hold).toFixed(8),
        usdcValue: b.coin === "USDC" ? b.total.toFixed(2) : "",

        unit: b.coin === "USDC" ? "USDC" : b.coin,
      })) ?? [];

    const allBalances = [perpBalances, ...spotBalances];
    // console.log("allBalances", allBalances, clearing, data);
    set({
      accountValue: clearing.marginSummary?.accountValue ?? 0,
      availableFunds: clearing.withdrawable ?? 0,
      positions: clearing.assetPositions ?? [],
      balances: spot.balances ?? [],
      allBalances,
    });
  },
  setAvailableFundsVsPositions: ({ available, positions }) =>
    set({ availableFunds: available, positions }),
  getPositionSize: (symbol: string) => {
    const positions = get().positions;
    const pos = positions.find(
      (p) => p.position?.coin.split("-")[0] === symbol
    );
    return pos?.position?.szi ?? 0;
  },
  getBalance: (coin: string) => {
    return get().balances.find((b) => b.coin === coin);
  },
  updateMarkPrices: (mids) => set({ markPrices: mids }),
  updateOrder: (orders) => set({ openOrders: orders }),
  // cancelOrder:
}));

import { useEffect } from "react";
import { get } from "lodash";
import { client } from "@/lib/hyperClient";
import { nextConfig } from "@/config";
import { useAppState } from "@/store/useAppState";
import { useMarketState } from "@/store/useMarketState";
import { ActiveAssetDataState } from "@coin98-hyper/core";

export function getLeverage(address?: string, symbol?: string) {
  const store = useMarketState.getState();
  const asset = store.activeAssetData[address ?? ""]?.[symbol ?? ""];
  const raw = get(asset, "leverage", 1);
  return typeof raw === "number" ? raw : get(raw, "value", 1);
}

export function useLeverage(symbol: string) {
  const addr = nextConfig.nextWalletAddress;
  const isConnected = useAppState((s) => s.isConnected);
  const leverage = getLeverage(addr, symbol);

  useEffect(() => {
    if (!isConnected || !addr) return;
    client.subscriptions.subscribeToUserActiveAssetData(
      addr,
      symbol,
      (data) => {
        const coin = get(data, "coin", "").split("-")[0];
        if (coin !== symbol) return;

        const mapped: ActiveAssetDataState = {
          user: data.user,
          coin: data.coin,
          leverage: data.leverage,
          maxTradeSzs: data.maxTradeSzs,
          availableToTrade: data.availableToTrade,
          markPx: "0",
        };

        useMarketState.getState().setActiveAssetData(addr, symbol, mapped);
      }
    );

    return () => {
      client.subscriptions.unsubscribeFromUserActiveAssetData(addr, symbol);
    };
  }, [isConnected, addr, symbol]);

  return leverage;
}

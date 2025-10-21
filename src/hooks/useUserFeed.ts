// hook to subscribe user data (WebSocket)
"use client";
import { useEffect } from "react";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { nextConfig } from "@/config";
import { useHyperConnected } from "./useHyperConnected";
import { useAppState } from "@/store/useAppState";
import { useMarketState } from "@/store/useMarketState";
import { getAllMarkets } from "@/lib/getAllMarkets";

export function useUserFeed() {
  const isConnected = useAppState((s) => s.isConnected);
  const updateFromFeed = useUserState((s) => s.updateFromFeed);
  const setMarkets = useMarketState((s) => s.setMarkets);

  useEffect(() => {
    const addr = nextConfig.nextWalletAddress;
    if (!addr || !isConnected) return;

    client.subscriptions.subscribeToWebData2(addr, (data) => {
      // console.log("data", data);
      if (!data?.clearinghouseState && !data?.spotState) return;

      updateFromFeed(data);
      const list = getAllMarkets({
        universe: data.meta.universe,
        assetCtxs: data.assetCtxs,
      });

      setMarkets(list.sort((a, b) => Number(b.markPx) - Number(a.markPx)));
    });
    console.log("🟢 Subscribed to WebData2 feed:", addr);

    return () => {
      client.subscriptions.unsubscribeFromWebData2(addr);
      console.log("🔴 Unsubscribed from WebData2 feed:", addr);
    };
  }, [nextConfig.nextWalletAddress, isConnected]);
}

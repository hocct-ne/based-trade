// hook to subscribe user data (WebSocket)
"use client";
import { useEffect } from "react";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { nextConfig } from "@/config";
import { useHyperConnected } from "./useHyperConnected";

export function useUserFeed() {
  const updateFromFeed = useUserState((s) => s.updateFromFeed);
  const { isConnected } = useHyperConnected();

  useEffect(() => {
    const addr = nextConfig.nextWalletAddress;
    if (!addr || !isConnected) return;

    client.subscriptions.subscribeToWebData2(addr, (data) => {
      // console.log("data", data);

      if (!data?.clearinghouseState && !data?.spotState) return;

      updateFromFeed(data);
    });

    console.log("🟢 Subscribed to WebData2 feed:", addr);

    return () => {
      client.subscriptions.unsubscribeFromWebData2(addr);
      console.log("🔴 Unsubscribed from WebData2 feed:", addr);
    };
  }, [nextConfig.nextWalletAddress, isConnected]);
}

"use client";

import { useEffect } from "react";
import { client } from "@/lib/hyperClient";
import { useTradeStore } from "@/store/useTradeStore";
import { useHyperConnected } from "./useHyperConnected";

export function useMarketFeed(symbol: string) {
  const { setMarkPrice } = useTradeStore();
  const { isConnected } = useHyperConnected();

  useEffect(() => {
    if (!isConnected || !symbol) return;

    console.log(`📡 Subscribing to mark price for ${symbol}...`);

    client.subscriptions.subscribeToAllMids((mids: Record<string, string>) => {
      const mid = mids[symbol];
      if (mid) setMarkPrice(Number(mid));
    });

    return () => {
      console.log(`🧹 Unsubscribing from mark price for ${symbol}`);
      client.subscriptions.unsubscribeFromAllMids();
    };
  }, [isConnected, symbol, setMarkPrice]);
}

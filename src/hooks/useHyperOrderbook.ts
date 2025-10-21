"use client";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";
import { useEffect, useState } from "react";

export function useHyperOrderbook(symbol: string) {
  const [orderbook, setOrderbook] = useState<{ asks: any[]; bids: any[] }>({
    asks: [],
    bids: [],
  });
  const isConnected = useAppState((s) => s.isConnected);
  useEffect(() => {
    if (!isConnected) return;
    client.subscriptions.subscribeToL2Book(symbol, (data: any) => {
      const asks = data.levels?.[0] || [];
      const bids = data.levels?.[1] || [];
      setOrderbook({ asks, bids });
    });
    console.log(`📡 Subscribed to trades.`);

    return () => {
      client.subscriptions.unsubscribeFromL2Book(symbol);
    };
  }, [symbol, isConnected]);

  return orderbook;
}

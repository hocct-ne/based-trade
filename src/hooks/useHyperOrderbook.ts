"use client";
import { client } from "@/lib/hyperClient";
import { useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";
import { useAppState } from "@/store/useAppState";

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
  }, [symbol, isConnected]);

  return orderbook;
}

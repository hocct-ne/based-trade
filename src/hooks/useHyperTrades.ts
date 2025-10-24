"use client";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";
import { useEffect, useState } from "react";

export function useHyperTrades(symbol: string) {
  const [trades, setTrades] = useState<any[]>([]);
  const isConnected = useAppState((s) => s.isConnected);

  useEffect(() => {
    if (!isConnected) return;
    client.subscriptions.subscribeToTrades(symbol, (trade: any) => {
      const newTrades = trade || [];
      setTrades((prev) => {
        const merged = [...newTrades, ...prev];
        return merged.slice(0, 50);
      });
    });
    console.log(`📡 Subscribed to trades.`);
  }, [symbol, isConnected]);

  return trades;
}

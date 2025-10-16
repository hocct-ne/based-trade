"use client";
import { client } from "@/lib/hyperClient";
import { useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";

export function useHyperTrades(symbol: string) {
  const [trades, setTrades] = useState<any[]>([]);
  const { isConnected } = useHyperConnected();

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

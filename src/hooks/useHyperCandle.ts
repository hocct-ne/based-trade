"use client";
import { useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";

export function useHyperCandle(symbol?: string, interval: string = "1m") {
  const [candles, setCandles] = useState<any[]>([]);
  const isConnected = useAppState((s) => s.isConnected);

  useEffect(() => {
    if (!isConnected) return;
    const candleHandler = (candle: any) => {
      // console.log("🔥 Candle received:", candle);
      setCandles((prev) => {
        return [...prev.slice(-99), candle];
      });
    };

    client.subscriptions.subscribeToCandle("ETH", "1h", candleHandler);
    console.log(`📡 Subscribed to ${symbol} ${interval} candles.`);
  }, [isConnected]);

  return candles;
}

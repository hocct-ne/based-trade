"use client";
import { useEffect, useState } from "react";
import { getHyperClient } from "@/lib/hyperClient";
const client = getHyperClient();
export function useHyperCandle(symbol?: string, interval: string = "1m") {
  const [candles, setCandles] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        if (!client.ws.isConnected()) {
          console.log("⏳ Connecting to Hyperliquid...");
          await client.connect();
          setIsSubscribed(true);

          console.log("✅ Connected to Hyperliquid");
        }
      } catch (err) {
        console.error("❌ Error in useHyperCandle setup or connection:", err);
      }
    };

    setupSubscription();
  }, []);

  useEffect(() => {
    // if (isSubscribed) {
    const candleHandler = (candle: any) => {
      console.log("🔥 Candle received:", candle);
      setCandles((prev) => {
        return [...prev.slice(-99), candle];
      });
    };

    client.subscriptions.subscribeToCandle("ETH", "1h", candleHandler);
    console.log(`📡 Subscribed to ${symbol} ${interval} candles.`);
    // }
  }, []);

  return candles;
}

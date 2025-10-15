"use client";
import { useEffect } from "react";
import { getHyperClient } from "@/lib/hyperClient";

export default function CandleFeed() {
  useEffect(() => {
    const hyperClient = getHyperClient();

    hyperClient.connect().then(() => {
      console.log("✅ Connected to Hyperliquid");

      hyperClient.subscriptions.subscribeToCandle(
        "BTC-PERP",
        "1m",
        (candle) => {
          console.log("New candle:", candle);
        }
      );
    });

    return () => {
      console.log("🧹 Cleaning up...");
      hyperClient.ws.close();
    };
  }, []);
}

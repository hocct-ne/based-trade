"use client";
import { useEffect, useState } from "react";
import { client } from "@/lib/hyperClient";

export function useHyperConnected() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        if (!client.ws.isConnected()) {
          console.log("⏳ Connecting to Hyperliquid...");
          await client.connect();
          setIsConnected(true);

          console.log("✅ Connected to Hyperliquid");
        }
      } catch (err) {
        console.error("❌ Error in useHyperCandle setup or connection:", err);
      }
    };

    setupSubscription();
  }, []);

  return { isConnected };
}

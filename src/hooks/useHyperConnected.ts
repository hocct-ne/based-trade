// src/hooks/useHyperConnected.ts
"use client";
import { useEffect } from "react";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";

export function useHyperConnected() {
  const setIsConnected = useAppState((s) => s.setIsConnected);

  const isConnected = useAppState((s) => s.isConnected);

  useEffect(() => {
    const setupConnection = async () => {
      if (!client.ws.isConnected()) {
        console.log("⏳ Connecting to Hyperliquid...");
        try {
          await client.connect();
          setIsConnected(true);
          console.log("✅ Connected to Hyperliquid");
        } catch (err) {
          console.error("❌ Error connecting to Hyperliquid:", err);
          setIsConnected(false);
        }
      } else if (!isConnected) {
        setIsConnected(true);
      }
    };

    setupConnection();
  }, [setIsConnected, isConnected]);
}

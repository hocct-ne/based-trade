"use client";

import { Hyperliquid } from "@coin98-hyper/core";

let client: Hyperliquid | null = null;

export function getHyperClient() {
  if (!client) {
    client = new Hyperliquid({
      enableWs: true,
      testnet: false,
      maxReconnectAttempts: 3,
    });
  }
  return client;
}

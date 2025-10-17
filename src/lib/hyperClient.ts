"use client";

import { Hyperliquid } from "@coin98-hyper/core";

let hyperClient: Hyperliquid | null = null;

function getHyperClient() {
  if (!hyperClient) {
    hyperClient = new Hyperliquid({
      enableWs: true,
      testnet: true,
    });
  }
  return hyperClient;
}

export const client = getHyperClient();

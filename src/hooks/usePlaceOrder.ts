"use client";

import { nextConfig } from "@/config";
import { client } from "@/lib/hyperClient";
import { ethers, TypedDataDomain, TypedDataField, Wallet } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";
import { usePositions } from "./usePositions";
import { useUserState } from "@/store/useUserState";

interface PlaceOrderParams {
  symbol: string;
  side: "long" | "short";
  orderType?: "limit" | "market";
  price?: number;
  size: number;
  leverage?: number;
}

const signTypedData = async (data: {
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  message: Record<string, any>;
}) => {
  const wallet = new ethers.Wallet(nextConfig.nextApiKey!);
  console.log(wallet, nextConfig.nextApiKey);

  const signature = await wallet.signTypedData(
    data.domain,
    data.types,
    data.message
  );
  return signature;
};

export function usePlaceOrder() {
  const { isConnected } = useHyperConnected();
  const [isPlacing, setIsPlacing] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const setAvailableFunds = useUserState((s) => s.setAvailableFunds);

  const placeOrder = useCallback(
    async ({
      symbol,
      side,
      orderType = "market",
      price,
      size,
      leverage = 20,
    }: PlaceOrderParams) => {
      if (!isConnected) {
        console.warn("❌ Cannot place order — not connected to Hyperliquid");
        return;
      }

      try {
        setIsPlacing(true);

        const w = Wallet.createRandom();
        const { action, signingData } =
          await client.exchange.prepareApproveAgent({
            agentAddress: w.address,
            agentName: "C98 Hyperliquid",
          });

        const sigMess = await signTypedData(signingData);
        const data = await client.exchange.approveAgent(action, sigMess);
        // console.log("data", data);

        const order = await client.exchange.placeOrder({
          agentPrivateKey: w.privateKey,
          reduce_only: false,
          coin: symbol,
          is_buy: side === "long",
          limit_px: price as number, //orderType === "limit" ? Number(price) : "",
          sz: size,
          order_type: { limit: { tif: "FrontendMarket" } },
        });

        const addr = nextConfig.nextWalletAddress;
        if (addr) {
          const clearing = await client.info.perpetuals.getClearinghouseState(
            addr
          );

          const available = clearing?.marginSummary?.accountValue ?? 0;
          setAvailableFunds(Number(available));
          console.log("💰 Updated available funds:", available);
        }

        console.log("✅ Order placed:", order);
        setLastOrder(order);

        return order;
      } catch (err: any) {
        console.error("❌ Failed to place order:", err);
        throw err;
      } finally {
        setIsPlacing(false);
      }
    },
    [isConnected]
  );

  return { placeOrder, isPlacing, lastOrder };
}

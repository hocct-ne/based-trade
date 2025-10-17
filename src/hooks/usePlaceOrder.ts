"use client";

import { nextConfig } from "@/config";
import { client } from "@/lib/hyperClient";
import { ethers, TypedDataDomain, TypedDataField, Wallet } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";
import { usePositions } from "./usePositions";

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
  const { addPosition } = usePositions();

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
        console.log("data", data);

        const order = await client.exchange.placeOrder({
          agentPrivateKey: w.privateKey,
          reduce_only: false,
          coin: "BTC-PERP",
          is_buy: side === "long",
          limit_px: 118000, //orderType === "limit" ? Number(price) : "",
          sz: "0.0001",
          order_type: { limit: { tif: "FrontendMarket" } },
        });

        // if (order?.status === "success") {
        //   const positions = await client.info.getUserPositions(userAddress);
        //   if (Array.isArray(positions)) {
        //     const pos = positions.find((p) => p.symbol === symbol);
        //     if (pos) addPosition(pos);
        //   }
        // }

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

  useEffect(() => {
    if (!nextConfig.nextWalletAddress || !client.ws.isConnected()) return;
    // your position
    client.subscriptions.subscribeToWebData2(
      nextConfig.nextWalletAddress,
      (data) => {
        console.log("data>", data);

        // Đôi lúc subscription trả về data của user khác do đó cần check lại để đảm bảo đúng user
        // const userAddress = get(data, "user", "").toLowerCase();

        // if (userAddress !== activeEvmRef.current?.toLowerCase()) return;
        // // -----
        // // const clearinghouseState = get(data, "clearinghouseState");
        // const openOrders = get(data, "openOrders", []);

        // throttledUpdateAssetsContext(data);
      }
    );

    return () => {
      client.subscriptions.unsubscribeFromWebData2(
        nextConfig.nextWalletAddress!
      );
    };
  }, [nextConfig.nextWalletAddress, client.ws.isConnected()]);

  return { placeOrder, isPlacing, lastOrder };
}

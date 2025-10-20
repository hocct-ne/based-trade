"use client";

import { nextConfig } from "@/config";
import { client } from "@/lib/hyperClient";
import { ethers, TypedDataDomain, TypedDataField, Wallet } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useHyperConnected } from "./useHyperConnected";
import { usePositions } from "./usePositions";
import { useUserState } from "@/store/useUserState";
import { parsePlaceOrderResponse } from "@coin98-hyper/core";

export enum TypeTrade {
  SPOT = "SPOT",
  PERP = "PERP",
}

export const DEFAULT_SLIPPAGE = 0.05; // Slippage 5%
export const DEFAULT_MIN_ORDER = 10;

interface PlaceOrderParams {
  symbol: string;
  side: "long" | "short";
  orderType?: "limit" | "market";
  price?: number;
  size: number;
  reduceOnly?: boolean;
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
  const setAvailableFundsVsPositions = useUserState(
    (s) => s.setAvailableFundsVsPositions
  );

  const placeOrder = useCallback(
    async ({
      symbol,
      side,
      orderType = "market",
      price,
      size,
      reduceOnly = false,
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

        const isBuy = side === "long";
        const convertedSymbol = await client.symbolConversion.convertSymbol(
          symbol,
          undefined,
          TypeTrade.PERP
        );

        const slippagePrice = await client.getSlippagePrice(
          convertedSymbol,
          isBuy,
          DEFAULT_SLIPPAGE,
          price
        );

        const convertSize = await client.convertSizePerp(convertedSymbol, size);

        const order = await client.exchange.placeOrder({
          agentPrivateKey: w.privateKey,
          reduce_only: reduceOnly,
          coin: symbol,
          is_buy: side === "long",
          limit_px: slippagePrice,
          sz: convertSize,
          order_type: { limit: { tif: "FrontendMarket" } },
        });

        const formatResult = parsePlaceOrderResponse(order);

        const addr = nextConfig.nextWalletAddress;
        if (addr) {
          const clearing = await client.info.perpetuals.getClearinghouseState(
            addr
          );

          const available = clearing?.withdrawable ?? 0;
          const positions = clearing?.assetPositions ?? [];

          setAvailableFundsVsPositions({
            available: Number(available),
            positions,
          });

          console.log("💰 Updated available funds:", available);
        }

        console.log("✅ Order placed:", order, formatResult);
        setLastOrder(formatResult);

        if (formatResult.success) return formatResult;

        throw new Error(formatResult.message);
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

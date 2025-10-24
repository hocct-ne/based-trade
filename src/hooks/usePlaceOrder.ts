"use client";

import { nextConfig } from "@/config";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";
import { useUserState } from "@/store/useUserState";
import { parsePlaceOrderResponse } from "@coin98-hyper/core";
import { useCallback, useState } from "react";
import { useAgent } from "./useAgent";
import { toast } from "@/lib/toast";

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
}

export function usePlaceOrder() {
  const isConnected = useAppState((s) => s.isConnected);
  const { ensureAgent } = useAgent();
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
    }: PlaceOrderParams) => {
      if (!isConnected) {
        console.error("❌ Cannot place order — not connected to Hyperliquid");
        return;
      }

      try {
        setIsPlacing(true);
        console.log("Placing order:", {
          symbol,
          side,
          size,
          price,
          reduceOnly,
        });
        const w = await ensureAgent();

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
        if (formatResult.success) {
          toast.success("Order submitted successfully");
          return formatResult;
        } else {
          toast.error(formatResult.message || "❌ Failed to place order");
        }
      } catch (err: any) {
        console.error("❌ Failed to place order:", err);
        toast.error("❌ Failed to place order", err);

        throw err;
      } finally {
        setIsPlacing(false);
      }
    },
    [isConnected]
  );

  return { placeOrder, isPlacing, lastOrder };
}

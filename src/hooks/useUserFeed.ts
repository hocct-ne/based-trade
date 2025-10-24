// hook to subscribe user data (WebSocket)
"use client";
import { nextConfig } from "@/config";
import { getAllMarkets } from "@/lib/getAllMarkets";
import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";
import { useMarketState } from "@/store/useMarketState";
import { Order, useUserState } from "@/store/useUserState";
import { useEffect } from "react";

export function useUserFeed() {
  const isConnected = useAppState((s) => s.isConnected);
  const updateFromFeed = useUserState((s) => s.updateFromFeed);
  const setMarkets = useMarketState((s) => s.setMarkets);
  const updateOrder = useUserState((s) => s.updateOrder);

  useEffect(() => {
    const addr = nextConfig.nextWalletAddress;

    if (!addr || !isConnected) return;
    client.exchange.transferBetweenSpotAndPerp;
  }, [nextConfig.nextWalletAddress, isConnected]);

  useEffect(() => {
    const addr = nextConfig.nextWalletAddress;
    if (!addr || !isConnected) return;

    client.subscriptions.subscribeToWebData2(addr, (data) => {
      // console.log("data", data);
      if (!data?.clearinghouseState && !data?.spotState) return;
      updateFromFeed(data);

      const list = getAllMarkets({
        universe: data.meta.universe,
        assetCtxs: data.assetCtxs,
      });
      setMarkets(list.sort((a, b) => Number(b.markPx) - Number(a.markPx)));

      const newOpenOrders: Order[] = (data.openOrders ?? [])
        .map((order: any) => {
          const size = order.sz;
          const price = order.limitPx;

          return {
            time: new Date(order.timestamp).toLocaleString("en-US", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            type: order.orderType,
            coin: order.coin,
            direction: order.side === "sell" ? "Sell" : "Buy",
            size: size,
            originalSize: order.origSz,
            orderValue: size * price,
            price: price,
            reduceOnly: order.reduceOnly,
            trigger: order.triggerCondition,
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        );
      updateOrder(newOpenOrders);
    });

    console.log("🟢 Subscribed to WebData2 feed:", addr);

    return () => {
      client.subscriptions.unsubscribeFromWebData2(addr);
      console.log("🔴 Unsubscribed from WebData2 feed:", addr);
    };
  }, [nextConfig.nextWalletAddress, isConnected]);
}

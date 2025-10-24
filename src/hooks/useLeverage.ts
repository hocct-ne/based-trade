import { useCallback, useEffect, useState } from "react";
import { get } from "lodash";
import { client } from "@/lib/hyperClient";
import { nextConfig } from "@/config";
import { useAppState } from "@/store/useAppState";
import { useMarketState } from "@/store/useMarketState";
import { ActiveAssetDataState } from "@coin98-hyper/core";
import { useAgent } from "./useAgent";
import { toast } from "@/lib/toast";

export function useLeverage(symbol: string) {
  const addr = nextConfig.nextWalletAddress;
  const isConnected = useAppState((s) => s.isConnected);
  const { ensureAgent } = useAgent();
  const leverage = useMarketState((s) =>
    get(s.activeAssetData[addr ?? ""]?.[symbol ?? ""], "leverage", 20)
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !addr) return;
    client.subscriptions.subscribeToUserActiveAssetData(
      addr,
      symbol,
      (data) => {
        const coin = get(data, "coin", "").split("-")[0];

        if (coin !== symbol) return;

        const mapped: ActiveAssetDataState = {
          user: data.user,
          coin: data.coin,
          leverage: data.leverage,
          maxTradeSzs: data.maxTradeSzs,
          availableToTrade: data.availableToTrade,
          markPx: "0",
        };

        useMarketState.getState().setActiveAssetData(addr, symbol, mapped);
      }
    );

    return () => {
      client.subscriptions.unsubscribeFromUserActiveAssetData(addr, symbol);
    };
  }, [isConnected, addr, symbol]);

  const updateLeverage = useCallback(
    async (newLeverage: number, isCross: boolean = false) => {
      try {
        setIsUpdating(true);
        setError(null);

        const agent = await ensureAgent();
        const convertedSymbol = await client.symbolConversion.convertSymbol(
          symbol,
          undefined,
          "PERP"
        );

        const res = await client.exchange.updateLeverage({
          symbol: convertedSymbol,
          isCross,
          leverage: newLeverage,
          agentPrivateKey: agent.privateKey,
        });
        console.log("res updateLeverage>>", res);

        if (addr) {
          const assetData = get(
            useMarketState.getState().activeAssetData[addr] ?? {},
            symbol
          );

          const updated: ActiveAssetDataState = {
            ...(assetData || {}),
            leverage: { ...assetData.leverage, value: newLeverage },
          };

          useMarketState.getState().setActiveAssetData(addr, symbol, updated);
        }

        if (res.status === "ok") {
          toast.success("Update leverage successfully");
        } else {
          toast.error(res.response);
        }

        console.log(`✅ Updated leverage to x${newLeverage} for ${symbol}`);
        return res;
      } catch (err: any) {
        console.error("❌ Failed to update leverage:", err);
        setError(err?.message || "Update leverage failed");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [symbol, ensureAgent]
  );

  return {
    leverage:
      typeof leverage === "number" ? leverage : get(leverage, "value", 20),
    updateLeverage,
  };
}

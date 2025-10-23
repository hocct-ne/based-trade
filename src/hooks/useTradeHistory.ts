import { useEffect, useState } from "react";

import { nextConfig } from "@/config";
import { client } from "@/lib/hyperClient";

interface TradeHistoryItem {
  time: string;
  coin: string;
  direction: string;
  price: number;
  size: number;
  tradeValue: number;
  fee: number;
  closedPnl: number;
}

function mapFillToTradeHistoryItem(fill: any): TradeHistoryItem {
  const isPerp = fill.coin.includes("-PERP");
  const size = isPerp ? fill.sz : fill.sz * fill.px;
  const tradeValue = fill.sz * fill.px;
  const fee = fill.fee * -1;

  return {
    time: new Date(fill.time).toLocaleTimeString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    coin: fill.coin.replace("-PERP", "").replace("-SPOT", ""),
    direction: fill.dir,
    price: parseFloat(fill.px.toFixed(isPerp ? 2 : 4)),
    size: parseFloat(size.toFixed(isPerp ? 5 : 2)),
    tradeValue: parseFloat(tradeValue.toFixed(2)),
    fee: parseFloat(fee.toFixed(2)),
    closedPnl: parseFloat(fill.closedPnl.toFixed(2)),
  };
}

export function useTradeHistory() {
  const [history, setHistory] = useState<TradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userAddress = nextConfig.nextWalletAddress;

  useEffect(() => {
    if (!userAddress) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    async function fetchHistory() {
      setIsLoading(true);

      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      try {
        const data = await client.info.getUserFillsByTime(
          userAddress!,
          sevenDaysAgo,
          now
        );
        console.log("dxsdsdata", data);

        const dataFormat: TradeHistoryItem[] = data
          .map(mapFillToTradeHistoryItem)
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          );
        console.log("dataFormat", dataFormat);

        setHistory(dataFormat);
      } catch (error) {
        console.error("Error fetching trade history:", error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [userAddress]);

  return { history, isLoading };
}

"use client";

import { useTradeHistory } from "@/hooks/useTradeHistory";
import { cn } from "@/lib/utils"; // Import cn để sử dụng khi cần thiết

export default function TradeHistoryTab() {
  const { history, isLoading } = useTradeHistory();

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Loading trade history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No trade history
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto text-[12px]!">
      <table className="w-full border-collapse">
        <thead className="text-xs text-muted-foreground border-b border-border/50">
          <tr className="text-left">
            <th className="px-2 py-2">Time</th>
            <th className="px-2 py-2">Coin</th>
            <th className="px-2 py-2">Direction</th>
            <th className="px-2 py-2 text-right">Price</th>
            <th className="px-2 py-2 text-right">Size</th>
            <th className="px-2 py-2 text-right">Trade Value</th>
            <th className="px-2 py-2 text-right">Fee</th>
            <th className="px-2 py-2 text-right">Closed PNL</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => {
            const isLongAction =
              item.direction.includes("Open Long") ||
              item.direction.includes("Close Short") ||
              item.direction === "Buy";

            return (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-muted/10 transition-colors"
              >
                <td className="px-2 py-2 text-muted-foreground">{item.time}</td>
                <td className="px-2 py-2">{item.coin}</td>

                <td
                  className={cn(
                    "px-2 py-2 font-medium",
                    isLongAction ? "text-[#29ab87]" : "text-[#ff5252]"
                  )}
                >
                  {item.direction}
                </td>

                <td className="px-2 py-2 text-right">
                  {item.price.toLocaleString()}
                </td>
                <td className="px-2 py-2 text-right">
                  {item.size.toLocaleString()} {item.coin}
                </td>
                <td className="px-2 py-2 text-right">
                  {item.tradeValue.toLocaleString()} USD
                </td>
                <td className="px-2 py-2 text-right">
                  {item.fee.toLocaleString()} USD
                </td>

                <td
                  className={cn(
                    "px-2 py-2 text-right",
                    item.closedPnl > 0 ? "text-[#29ab87]" : "text-[#ff5252]"
                  )}
                >
                  {item.closedPnl > 0 ? "+" : ""}
                  {item.closedPnl.toLocaleString()} USD
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

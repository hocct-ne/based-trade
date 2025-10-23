"use client";

import { Button } from "@/components/ui/button";
import { useUserState } from "@/store/useUserState";
import { useState } from "react";
import { ClosePositionDialog } from "../ClosePositionDialog";
import { cn } from "@/lib/utils";

export default function PositionsTab() {
  const positions = useUserState((s) => s.positions);
  const markPrices = useUserState((s) => s.markPrices);
  const [selectedPos, setSelectedPos] = useState<any | null>(null);

  if (!positions || positions.length === 0) {
    return (
      <div
        className="text-sm text-muted-foreground text-center py-8"
        data-testid="text-no-positions"
      >
        No open positions
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto text-[12px]!">
      <table className="w-full">
        <thead className="text-xs text-muted-foreground border-b border-border">
          <tr className="text-left">
            <th className="px-2 py-2">Coin</th>
            <th className="px-2 py-2">Size</th>
            <th className="px-2 py-2">Position Value</th>
            <th className="px-2 py-2">Entry Price</th>
            <th className="px-2 py-2">Mark Price</th>
            <th className="px-2 py-2">PNL (ROE %)</th>
            <th className="px-2 py-2">Liq. Price</th>
            <th className="px-2 py-2">Margin</th>
            <th className="px-2 py-2">Funding</th>
            <th className="px-2 py-2 text-center">Close All</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((pos, idx) => {
            const p = pos.position;
            const side = p.szi > 0 ? "long" : p.szi < 0 ? "short" : "none";
            const coin = p.coin.replace("-PERP", "");
            const roe = p.returnOnEquity * 100;
            const isProfit = p.unrealizedPnl >= 0;

            return (
              <tr
                key={idx}
                className="border-b border-border/50 hover:bg-muted/10"
              >
                <td
                  className={cn(
                    "px-2 py-2 font-medium text-left pl-3",
                    side === "long"
                      ? "bg-[linear-gradient(90deg,rgb(31,166,125)_0px,rgb(31,166,125)_4px,rgb(11,50,38)_4px,transparent_100%)]"
                      : "bg-[linear-gradient(90deg,rgb(255,82,82)_0px,rgb(255,82,82)_4px,rgb(50,11,11)_4px,transparent_100%)]"
                  )}
                >
                  {coin} {p.leverage.value}x
                </td>

                <td
                  className={`px-2 py-2 ${
                    side === "long" ? "text-[#29ab87]" : "text-[#ff5252]"
                  }`}
                >
                  {Number(p.szi.toFixed(4)).toLocaleString()} {coin}
                </td>
                <td className="px-2 py-2">
                  ${Number(p.positionValue.toFixed(2)).toLocaleString()}
                </td>
                <td className="px-2 py-2">
                  {Number(p.entryPx.toFixed(1)).toLocaleString()}
                </td>
                <td className="px-2 py-2">
                  {markPrices[p.coin] != null
                    ? Number(markPrices[p.coin]).toLocaleString("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })
                    : "-"}
                </td>
                <td
                  className={`px-2 py-2 ${
                    isProfit ? "text-[#29ab87]" : "text-[#ff5252]"
                  }`}
                >
                  {isProfit ? "+" : ""}$
                  {Number(p.unrealizedPnl.toFixed(2)).toLocaleString()} (
                  {roe.toFixed(1)}%)
                </td>
                <td className="px-2 py-2">
                  {Number(p.liquidationPx.toFixed(1)).toLocaleString()}
                </td>
                <td className="px-2 py-2">
                  ${Number(p.marginUsed.toFixed(2)).toLocaleString()} (
                  {p.leverage.type})
                </td>
                <td
                  className={`px-2 py-2 ${
                    Number(p.cumFunding.sinceOpen) > 0
                      ? "text-[#29ab87]"
                      : "text-[#ff5252]"
                  }`}
                >
                  $
                  {p.cumFunding?.sinceOpen
                    ? Number(p.cumFunding.sinceOpen.toFixed(2)).toLocaleString()
                    : "0"}
                </td>
                <td className="px-2 py-2 space-x-1 text-[#50D2C1] text-center">
                  {/* <Button variant="ghost" size="sm">
                    Limit
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPos(p)}
                  >
                    Market
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedPos && (
        <ClosePositionDialog
          symbol={selectedPos.coin}
          size={Math.abs(selectedPos.szi)}
          isOpen={!!selectedPos}
          onClose={() => setSelectedPos(null)}
        />
      )}
    </div>
  );
}

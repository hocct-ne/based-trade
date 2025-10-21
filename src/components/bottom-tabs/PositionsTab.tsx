"use client";

import { Button } from "@/components/ui/button";
import { useClosePosition } from "@/hooks/useClosePosition";
import { useUserState } from "@/store/useUserState";
import { useState } from "react";
import { ClosePositionDialog } from "../ClosePositionDialog";

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
            const coin = p.coin.replace("-PERP", "");
            const roe = p.returnOnEquity * 100;
            const isProfit = p.unrealizedPnl >= 0;

            return (
              <tr
                key={idx}
                className="border-b border-border/50 hover:bg-muted/10"
              >
                <td className="px-2 py-2 font-medium text-left pl-3 bg-[linear-gradient(90deg,rgb(31,166,125)_0px,rgb(31,166,125)_4px,rgb(11,50,38)_4px,transparent_100%)]">
                  {coin} {p.leverage.value}x
                </td>

                <td className="px-2 py-2 text-[#29ab87]">
                  {p.szi.toFixed(4)} {coin}
                </td>
                <td className="px-2 py-2">${p.positionValue.toFixed(2)}</td>
                <td className="px-2 py-2">{p.entryPx.toFixed(1)}</td>
                <td className="px-2 py-2">
                  {Number(markPrices[p.coin]).toFixed(1) ?? "-"}
                </td>
                <td
                  className={`px-2 py-2 ${
                    isProfit ? "text-[#29ab87]" : "text-[#ff5252]"
                  }`}
                >
                  {isProfit ? "+" : ""}${p.unrealizedPnl.toFixed(2)} (
                  {roe.toFixed(1)}%)
                </td>
                <td className="px-2 py-2">{p.liquidationPx.toFixed(1)}</td>
                <td className="px-2 py-2">
                  ${p.marginUsed.toFixed(2)} ({p.leverage.type})
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
                    ? p.cumFunding.sinceOpen.toFixed(3)
                    : "-"}
                </td>
                <td className="px-2 py-2 space-x-1 text-[#50D2C1]">
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

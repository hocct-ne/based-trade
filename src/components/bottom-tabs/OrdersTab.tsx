"use client";

import { useUserState } from "@/store/useUserState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OrdersTab() {
  const openOrders = useUserState((s) => s.openOrders);

  if (!openOrders || openOrders.length === 0)
    return (
      <div
        className="text-sm text-muted-foreground text-center py-8"
        data-testid="text-no-orders"
      >
        No open orders
      </div>
    );

  return (
    <div className="w-full overflow-x-auto text-[12px]!">
      <table className="w-full border-collapse">
        <thead className="text-xs text-muted-foreground border-b border-border/50">
          <tr className="text-left">
            <th className="px-2 py-2">Time</th>
            <th className="px-2 py-2">Type</th>
            <th className="px-2 py-2">Coin</th>
            <th className="px-2 py-2">Direction</th>
            <th className="px-2 py-2 text-right">Size</th>
            <th className="px-2 py-2 text-right">Original Size</th>
            <th className="px-2 py-2 text-right">Order Value</th>
            <th className="px-2 py-2 text-right">Price</th>
            <th className="px-2 py-2 text-center">Reduce Only</th>
            <th className="px-2 py-2 text-center">Trigger</th>
            <th className="px-2 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {openOrders.map((o, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-muted/10 transition-colors"
            >
              <td className="px-2 py-2 text-muted-foreground">{o.time}</td>
              <td className="px-2 py-2">{o.type}</td>
              <td className="px-2 py-2">{o.coin}</td>
              <td
                className={cn(
                  "px-2 py-2 font-medium",
                  o.direction === "Buy" ? "text-[#29ab87]" : "text-[#ff5252]"
                )}
              >
                {o.direction}
              </td>
              <td className="px-2 py-2 text-right">{o.size}</td>
              <td className="px-2 py-2 text-right">{o.originalSize}</td>
              <td className="px-2 py-2 text-right">
                {o.orderValue.toLocaleString()} USDC
              </td>
              <td className="px-2 py-2 text-right">
                {o.price.toLocaleString()}
              </td>
              <td className="px-2 py-2 text-center">
                {o.reduceOnly ? "Yes" : "--"}
              </td>
              <td className="px-2 py-2 text-center">{o.trigger ?? "N/A"}</td>
              <td className="px-2 py-2 space-x-1 text-[#50D2C1] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => cancelOrder(String(i))}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

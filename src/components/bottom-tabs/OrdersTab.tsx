"use client";

import { useUserState } from "@/store/useUserState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function OrdersTab() {
  const { openOrders } = useUserState();

  useEffect(() => {
    useUserState.getState().updateOrder([
      {
        time: "10/17/2025 - 15:32:51",
        type: "Limit",
        coin: "BTC-PERP",
        direction: "Sell",
        size: 1,
        originalSize: 1,
        orderValue: 82,
        price: 82.0,
        reduceOnly: false,
        trigger: "N/A",
      },
      {
        time: "9/24/2025 - 23:41:55",
        type: "Limit",
        coin: "ETH-PERP",
        direction: "Sell",
        size: 2,
        originalSize: 2,
        orderValue: 400,
        price: 200,
        reduceOnly: false,
        trigger: "N/A",
      },
    ]);
  }, []);

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
    <div className="overflow-x-auto text-sm">
      <table className="w-full border-collapse">
        <thead className="border-b border-border/50 text-muted-foreground">
          <tr>
            <th className="text-left px-3 py-2">Time</th>
            <th className="text-left px-3 py-2">Type</th>
            <th className="text-left px-3 py-2">Coin</th>
            <th className="text-left px-3 py-2">Direction</th>
            <th className="text-right px-3 py-2">Size</th>
            <th className="text-right px-3 py-2">Original Size</th>
            <th className="text-right px-3 py-2">Order Value</th>
            <th className="text-right px-3 py-2">Price</th>
            <th className="text-center px-3 py-2">Reduce Only</th>
            <th className="text-center px-3 py-2">Trigger</th>
            <th className="text-center px-3 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {openOrders.map((o, i) => (
            <tr
              key={i}
              className="border-b border-border/30 hover:bg-muted/10 transition-colors"
            >
              <td className="px-3 py-2 text-muted-foreground">{o.time}</td>
              <td className="px-3 py-2">{o.type}</td>
              <td className="px-3 py-2">{o.coin}</td>
              <td
                className={cn(
                  "px-3 py-2 font-medium",
                  o.direction === "Buy" ? "text-[#29ab87]" : "text-[#ff5252]"
                )}
              >
                {o.direction}
              </td>
              <td className="px-3 py-2 text-right">{o.size}</td>
              <td className="px-3 py-2 text-right">{o.originalSize}</td>
              <td className="px-3 py-2 text-right">{o.orderValue}</td>
              <td className="px-3 py-2 text-right">{o.price}</td>
              <td className="px-3 py-2 text-center">
                {o.reduceOnly ? "Yes" : "--"}
              </td>
              <td className="px-3 py-2 text-center">{o.trigger ?? "N/A"}</td>
              <td className="px-2 py-2 space-x-1 text-[#50D2C1] text-center">
                {/* <Button variant="ghost" size="sm">
                    Limit
                  </Button> */}
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

"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHyperOrderbook } from "@/hooks/useHyperOrderbook";
import { useHyperTrades } from "@/hooks/useHyperTrades";
import { useEffect, useState } from "react";
``;
interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

// interface OrderBookProps {
//   bids: OrderBookEntry[];
//   asks: OrderBookEntry[];
//   spread: number;
//   spreadPercent: number;
// }

export default function OrderBook() {
  const orderbook = useHyperOrderbook("ETH");
  const historyTrades = useHyperTrades("ETH");
  // console.log("aa", historyTrades);

  const { asks: asksValue, bids: bidsValue } = orderbook;

  const calcTotals = (levels: any[]) => {
    let total = 0;
    return levels.map((lvl) => {
      total += parseFloat(lvl.sz);
      return { ...lvl, total };
    });
  };

  const asksWithTotal = calcTotals([...asksValue].reverse());
  const bidsWithTotal = calcTotals(bidsValue);

  const maxAsk = Math.max(...asksWithTotal.map((a) => a.total || 0), 1);
  const maxBid = Math.max(...bidsWithTotal.map((b) => b.total || 0), 1);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <Tabs
        defaultValue="orderbook"
        className="flex-1 flex flex-col overflow-auto"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-border h-10 bg-transparent p-0">
          <TabsTrigger
            value="orderbook"
            className="w-[50%] h-10  rounded-none data-[state=active]:bg-accent"
            data-testid="tab-orderbook"
          >
            Order Book
          </TabsTrigger>
          <TabsTrigger
            value="trades"
            className="w-[50%] h-10 rounded-none data-[state=active]:bg-accent"
            data-testid="tab-trades"
          >
            Trades
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="orderbook"
          className="flex-1 flex flex-col m-0 overflow-hidden"
        >
          <div className="flex justify-between text-xs text-muted-foreground px-2 py-1.5 border-b border-border">
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>

          <div className="text-[13px] flex-1 flex flex-col overflow-auto">
            <div className="flex-1 overflow-auto flex flex-col-reverse">
              {asksWithTotal.map((ask, i) => {
                const pct = ask.total / maxAsk;
                return (
                  <div
                    key={i}
                    className="flex justify-between px-2 py-[2px] relative"
                  >
                    <div
                      className="absolute inset-0 bg-red-500/10"
                      style={{ width: `${pct * 100}%`, right: 0 }}
                    />
                    <span className="text-[#ff5252] z-10">
                      {parseFloat(ask.px).toFixed(2)}
                    </span>
                    <span className="z-10">
                      {parseFloat(ask.sz).toFixed(2)}
                    </span>
                    <span className="z-10">{ask.total.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="py-1 px-2 bg-accent/50 border-y border-border">
              <div className="relative flex justify-between text-xs">
                <span className={"w-1/3 text-left"}>Spread</span>
                <span className="w-1/3 text-center text-foreground">
                  {/* {spread.toFixed(2)} */}
                </span>
                <span className="w-1/3 text-right text-muted-foreground">
                  {/* {spreadPercent.toFixed(2)}% */}
                </span>
                {asksValue[0] && bidsValue[0] && (
                  <span>
                    {(
                      parseFloat(asksValue[0].px) - parseFloat(bidsValue[0].px)
                    ).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {bidsWithTotal.map((bid, i) => {
                const pct = bid.total / maxBid;
                return (
                  <div
                    key={i}
                    className="flex justify-between px-2 py-[2px] relative"
                  >
                    <div
                      className="absolute inset-0 bg-green-500/10"
                      style={{ width: `${pct * 100}%`, right: 0 }}
                    />
                    <span className="text-[#29ab87] z-10">
                      {parseFloat(bid.px).toFixed(2)}
                    </span>
                    <span className="z-10">
                      {parseFloat(bid.sz).toFixed(2)}
                    </span>
                    <span className="z-10">{bid.total.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="trades"
          className="flex-1 flex flex-col m-0 overflow-hidden"
        >
          <div className="flex justify-between text-xs text-muted-foreground px-2 py-1.5 border-b border-border">
            <span>Price</span>
            <span>Amount</span>
            <span>Time</span>
          </div>
          <div className="overflow-auto flex-1">
            {historyTrades.length > 0 ? (
              historyTrades.map((t, i) => (
                <div
                  key={i}
                  className={` text-[13px] flex justify-between px-2 py-[2px] ${
                    t.side === "B" ? "text-[#29ab87]" : "text-[#ff5252]"
                  }`}
                >
                  <span>{parseFloat(t.px).toFixed(2)}</span>
                  <span>{parseFloat(t.sz).toFixed(3)}</span>
                  <span>{new Date(t.time).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-4">
                Recent trades will appear here
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

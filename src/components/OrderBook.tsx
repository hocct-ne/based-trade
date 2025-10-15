"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export default function OrderBook({
  bids,
  asks,
  spread,
  spreadPercent,
}: OrderBookProps) {
  const renderOrderRow = (
    entry: OrderBookEntry,
    type: "bid" | "ask",
    maxTotal: number
  ) => {
    const percentage = (entry.total / maxTotal) * 100;

    return (
      <div
        key={entry.price}
        className="relative group hover-elevate py-0.5 px-2"
        data-testid={`row-orderbook-${type}`}
      >
        <div
          className={`absolute inset-y-0 right-0 ${
            type === "bid" ? "bg-success/10" : "bg-danger/10"
          }`}
          style={{ width: `${percentage}%` }}
        />
        <div className="relative flex justify-between text-xs font-mono">
          <span className={type === "bid" ? "text-success" : "text-danger"}>
            {entry.price.toFixed(2)}
          </span>
          <span className="text-foreground">{entry.amount.toFixed(5)}</span>
          <span className="text-muted-foreground">
            {entry.total.toFixed(5)}
          </span>
        </div>
      </div>
    );
  };

  const maxTotal = Math.max(
    ...asks.map((a) => a.total),
    ...bids.map((b) => b.total)
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <Tabs defaultValue="orderbook" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border h-10 bg-transparent p-0">
          <TabsTrigger
            value="orderbook"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-orderbook"
          >
            Order Book
          </TabsTrigger>
          <TabsTrigger
            value="trades"
            className="rounded-none data-[state=active]:bg-accent"
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

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto flex flex-col-reverse">
              {asks
                .slice()
                .reverse()
                .map((ask) => renderOrderRow(ask, "ask", maxTotal))}
            </div>

            <div className="py-2 px-2 bg-accent/50 border-y border-border">
              <div
                className="text-lg font-mono font-semibold"
                data-testid="text-spread-price"
              >
                {asks[0]?.price.toFixed(2)}
              </div>
              <div className="text-xs text-warning" data-testid="text-spread">
                Spread: {spread.toFixed(2)} ({spreadPercent.toFixed(2)}%)
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {bids.map((bid) => renderOrderRow(bid, "bid", maxTotal))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="flex-1 m-0">
          <div className="text-sm text-muted-foreground p-4">
            Recent trades will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

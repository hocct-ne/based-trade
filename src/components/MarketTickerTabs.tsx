"use client";
import { Market } from "@/store/useMarketState";

export function MarketTickerTabs({ TickerData }: { TickerData: Market[] }) {
  const filteredData = TickerData.filter((item) => {
    return item.type?.toLowerCase();
  });

  return (
    <div className="text-xs  ">
      <div className="flex items-center gap-4 ">
        {filteredData.slice(0, 5).map((item, index) => {
          const isPositive = Number(item.change24h) >= 0;
          return (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center gap-1"
            >
              <span
                className={`${
                  isPositive ? "text-[#29ab87]" : "text-[#ff5252]"
                }`}
              >
                {isPositive ? "+" : ""}
                {Number(item.change24h).toFixed(2)}%
              </span>

              <span className="text-white whitespace-nowrap">
                {item.symbol}
              </span>

              <span className="text-muted-foreground">
                {Number(item.markPx).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

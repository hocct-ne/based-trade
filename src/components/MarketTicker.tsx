"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/store/useAppState";

interface MarketTickerProps {
  pair: string;
  markPrice: number;
  change24h: number;
  change24hPercent: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  fundingCountdown: string;
  onPairChange?: (pair: string) => void;
}

export default function MarketTicker({
  pair,
  markPrice,
  change24h,
  change24hPercent,
  volume24h,
  openInterest,
  fundingRate,
  fundingCountdown,
  onPairChange,
}: MarketTickerProps) {
  const isPositive = change24h >= 0;

  const nf0 = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const nf2 = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const TickerData = [
    { symbol: "BTC", price: markPrice || 111270.5, change24hPercent: -3.24 },
    { symbol: "ETH", price: 3856.6, change24hPercent: -4.61 },
    { symbol: "SOL", price: 200.6, change24hPercent: -5.61 },
  ];
  const { tickers } = useAppState();
  // console.log("tickers", tickers);

  return (
    <>
      <div
        className="h-[56px] border-b border-border bg-card flex items-center px-4 gap-6 overflow-x-auto"
        suppressHydrationWarning
      >
        {TickerData.map((item, index) => {
          const isPositive = item.change24hPercent >= 0;

          return (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              <span className="font-bold">{item.symbol}</span>

              <div
                className={`flex items-center gap-1 ${
                  isPositive ? "text-[#29ab87]]" : "text-[#ff5252]"
                }`}
              >
                {item.change24hPercent > 0 ? "+" : ""}
                {item.change24hPercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-[56px] border-b border-border bg-card flex items-center px-4 gap-6 overflow-x-auto">
        <Select value={pair} onValueChange={onPairChange}>
          <SelectTrigger
            className="min-w-[140px] w-[140px] border-none focus:ring-0 gap-2"
            data-testid="select-trading-pair"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC-USD">BTC-USD</SelectItem>
            <SelectItem value="ETH-USD">ETH-USD</SelectItem>
            <SelectItem value="SOL-USD">SOL-USD</SelectItem>
            <SelectItem value="HYPE-USD">HYPE-USD</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-6 text-sm text-[13px]">
          <div>
            <div className="text-muted-foreground mb-1">Mark</div>
            <div className=" font-semibold ">{nf0.format(markPrice)}</div>
          </div>

          <div>
            <div className="min-w-[30px] text-muted-foreground mb-1">
              Oracle
            </div>
            <div className=" font-semibold text-[13px]">
              {nf0.format(markPrice)}
            </div>
          </div>

          <div>
            <div className="min-w-[80px] text-muted-foreground mb-1">
              24h Change
            </div>
            <div
              className={`min-w-[145px] flex items-center gap-1 ${
                isPositive ? "text-success" : "text-danger"
              }`}
            >
              {change24h > 0 ? "+" : ""}
              {nf2.format(change24h)} / {isPositive ? "+" : ""}
              {nf2.format(change24hPercent)}%
            </div>
          </div>

          <div>
            <div className="min-w-[30px] text-muted-foreground mb-1">
              24h Vol
            </div>
            <div className="">${nf2.format(volume24h / 1e9)}B</div>
          </div>

          <div>
            <div className="min-w-[90px] text-muted-foreground mb-1">
              Open Interest
            </div>
            <div className="">${nf2.format(openInterest / 1e9)}B</div>
          </div>

          <div>
            <div className="min-w-[140px] text-muted-foreground mb-1">
              Funding / Countdown
            </div>
            <div className="">
              {fundingRate > 0 ? "" : "-"}
              <span
                className={`${
                  fundingRate > 0 ? "text-[#29ab87]" : "text-danger"
                }`}
              >
                {nf2.format(fundingRate * 100)}%
              </span>
              / {fundingCountdown}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

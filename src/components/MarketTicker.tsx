"use client";
import { useMarketState } from "@/store/useMarketState";
import { useEffect, useState } from "react";
import { MarketSelect } from "./MarketSelect";
import { MarketTickerTabs } from "./MarketTickerTabs";

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
const nf0 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const nf2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nf4 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const timeStringToSeconds = (timeString: any) => {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
};

const secondsToTimeString = (totalSeconds: any) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

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
  const markets = useMarketState((s) => s.markets);
  const currentMarket = markets.find(
    (m) => m.symbol.split("-")[0] === pair.split("-")[0]
  );
  const [timeLeft, setTimeLeft] = useState(() =>
    timeStringToSeconds(fundingCountdown)
  );

  const currentMarkPx = currentMarket?.markPx
    ? parseFloat(currentMarket.markPx)
    : markPrice;
  const currentOraclePx = currentMarket?.oraclePx
    ? parseFloat(currentMarket.oraclePx)
    : markPrice;
  const currentChange24h = currentMarket?.change24hValue ?? change24h;
  const currentChange24hPercent = currentMarket?.change24h ?? change24hPercent;
  const currentVolume24h = currentMarket?.volume24h ?? volume24h;
  const currentOpenInterest = openInterest;
  const currentFundingRate = currentMarket?.funding ?? fundingRate;
  const isPositive = currentChange24h >= 0;
  const formatFundingRate = (rate: number) => {
    return nf4.format(rate * 100);
  };

  const formatValue = (value: number) => {
    return nf2.format(value);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime: any) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const countdownDisplay = secondsToTimeString(timeLeft);
  return (
    <>
      <div
        className="h-[56px] border-b border-border bg-card flex items-center px-4 gap-6 overflow-x-auto"
        suppressHydrationWarning
      >
        <MarketTickerTabs TickerData={markets} />
      </div>

      <div className="h-[56px] border-b border-border bg-card flex items-center px-4 gap-6 overflow-x-auto">
        <MarketSelect
          pair={pair}
          onPairChange={onPairChange}
          markets={markets}
        />

        <div className="flex items-center gap-6 text-sm text-[13px]">
          <div className="flex items-center gap-6 text-sm text-[13px]">
            <div>
              <div className="text-muted-foreground mb-1">Mark</div>
              <div className=" font-semibold ">{nf0.format(currentMarkPx)}</div>
            </div>

            <div>
              <div className="min-w-[30px] text-muted-foreground mb-1">
                Oracle
              </div>
              <div className=" font-semibold text-[13px]">
                {nf0.format(currentOraclePx)}
              </div>
            </div>

            <div>
              <div className="min-w-[100px] text-muted-foreground mb-1">
                24h Change
              </div>
              <div
                className={`min-w-[110px] flex items-center gap-1 ${
                  isPositive ? "text-[#29ab87]" : "text-[#ff5252]"
                }`}
              >
                {currentChange24h > 0 ? "+" : ""}
                {nf0.format(currentChange24h)} / {isPositive ? "+" : ""}
                {nf2.format(currentChange24hPercent)}%
              </div>
            </div>

            <div>
              <div className="min-w-[90px] text-muted-foreground mb-1">
                24h Volume
              </div>
              <div className="">${formatValue(currentVolume24h)}</div>
            </div>

            <div>
              <div className="min-w-[90px] text-muted-foreground mb-1">
                Open Interest
              </div>
              <div className="">${formatValue(currentOpenInterest)}</div>
            </div>

            <div>
              <div className="min-w-[140px] text-muted-foreground mb-1">
                Funding / Countdown
              </div>
              <div className="">
                {currentFundingRate < 0 ? "-" : ""}
                <span
                  className={`${
                    currentFundingRate >= 0 ? "text-[#29ab87]" : "text-danger"
                  }`}
                >
                  {formatFundingRate(Math.abs(currentFundingRate))}%
                </span>{" "}
                / {countdownDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

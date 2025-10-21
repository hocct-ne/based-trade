"use client";

import { cn } from "@/lib/utils";
import TradingViewAdvanced from "./TradingViewAdvanced";
import { memo } from "react";

interface Props {
  className?: string;
  symbol: string;
}

const TradingChart: React.FC<Props> = ({ className, symbol, ...props }) => {
  return (
    <div className={cn("wrapTradingChart", "relative", className)} {...props}>
      <TradingViewAdvanced symbol={symbol} />
    </div>
  );
};

export default memo(TradingChart);

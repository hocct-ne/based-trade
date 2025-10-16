"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradeFormProps {
  symbol: string;
  availableFunds: number;
  currentPosition: number;
  markPrice: number;
}

export default function TradeForm({
  symbol,
  availableFunds,
  currentPosition,
  markPrice,
}: TradeFormProps) {
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [leverage, setLeverage] = useState(20);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"long" | "short">("long");
  const [price, setPrice] = useState(markPrice.toFixed(2));
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState("");

  const handleSliderChange = (value: number[]) => {
    setPercent(value[0]);
    const usdValue = (availableFunds * value[0]) / 100;
    const qty = usdValue / Number(price || markPrice);
    setAmount(qty.toFixed(5));
  };

  const handlePlaceOrder = () => {
    console.log("🚀 Placing order:", {
      symbol,
      marginMode,
      leverage,
      orderType,
      side,
      price,
      amount,
      percent,
    });
  };

  return (
    <div className="bg-background border border-border overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-border text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("text-[13px] rounded-md px-3 py-1")}
            onClick={() => setMarginMode("cross")}
          >
            Cross
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("text-[13px] rounded-md px-3 py-1")}
            onClick={() => setMarginMode("cross")}
          >
            {leverage}x
          </Button>
        </div>

        <Select value={orderType} onValueChange={(v) => setOrderType(v as any)}>
          <SelectTrigger className="flex-1 h-7 text-xs border-border">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="limit">Limit</SelectItem>
            <SelectItem value="market">Market</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex p-2 justify-between gap-2">
        <Button
          onClick={() => setSide("long")}
          className={cn(
            "border-b border-border flex-1 rounded-md",
            side === "long"
              ? "bg-[#29ab87] hover:bg-[#29ab87] text-black rounded-md"
              : "bg-transparent"
          )}
        >
          Long
        </Button>
        <Button
          onClick={() => setSide("short")}
          className={cn(
            "border-b border-borde flex-1 rounded-md",
            side === "short"
              ? "bg-[#ff5252] hover:bg-[#ff5252] text-black"
              : "bg-transparent"
          )}
        >
          Short
        </Button>
      </div>

      <div className="px-3 py-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Available Funds</span>
          <span className="font-mono">{availableFunds.toFixed(2)} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Position</span>
          <span className="font-mono">
            {currentPosition.toFixed(5)} {symbol.split("-")[0]}
          </span>
        </div>
      </div>

      {orderType === "limit" && (
        <div className="px-3 py-2">
          <label className="text-xs text-muted-foreground block mb-1">
            Price (USDC)
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="font-mono text-right"
          />
        </div>
      )}

      <div className="px-3 py-2">
        <div className="flex justify-between mb-1 text-xs text-muted-foreground">
          <span>Amount ({symbol.split("-")[0]})</span>
          <span>{percent}%</span>
        </div>
        <Slider
          value={[percent]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-[11px] mt-1 text-muted-foreground">
          {[25, 33, 50, 66, 75, 100].map((v) => (
            <button
              key={v}
              onClick={() => handleSliderChange([v])}
              className="hover:text-foreground transition"
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 flex justify-between text-xs">
        <div className="flex gap-3">
          <label className="flex items-center gap-1">
            <input type="checkbox" className="accent-primary" /> Reduce
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" className="accent-primary" /> TP/SL
          </label>
        </div>
      </div>

      <div className="p-3 bg-muted/10 text-center text-xs border-t border-border">
        <p className="text-muted-foreground mb-2">
          You need funds to start trading. Deposit now to get started.
        </p>
        <Button className="bg-[#ff6940] hover:bg-[#ff6940] w-full rounded-md">
          Deposit
        </Button>
      </div>

      <div className="p-3 border-t border-border text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Est Liq:</span>
          <span className="font-mono">$0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Val:</span>
          <span className="font-mono">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Margin Req:</span>
          <span className="font-mono">$0.00</span>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          onClick={handlePlaceOrder}
          className={cn(
            "w-full rounded-md text-white",
            side === "long"
              ? "bg-[#29ab87] hover:bg-[#29ab87]"
              : "bg-[#ff5252] hover:bg-[#ff5252]"
          )}
        >
          {side === "long" ? "Long" : "Short"} {symbol.split("-")[0]}
        </Button>
      </div>
    </div>
  );
}

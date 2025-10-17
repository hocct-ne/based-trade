"use client";

import { useEffect, useState } from "react";
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
import { useTradeStore } from "@/store/useTradeStore";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { MarginModeSelector } from "./MarginModeSelector";
import { LeverageSelector } from "./LeverageSelector";

interface TradeFormProps {
  symbol: string;
}

export default function TradeForm({ symbol }: TradeFormProps) {
  //   const sdk = getHyperClient();
  // const balances = await sdk.info.getBalances(userAddress);
  // const positions = await sdk.info.getUserOpenOrders(userAddress);

  const { availableFunds, currentPosition, markPrice } = useTradeStore();
  const { placeOrder, isPlacing } = usePlaceOrder();

  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [leverage, setLeverage] = useState(20);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"long" | "short">("long");
  const [price, setPrice] = useState<number>(markPrice);
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [isManualPriceInput, setIsManualPriceInput] = useState(false);

  const orderValue = (price ?? markPrice) * (amount ?? 0);
  const marginReq = orderValue / leverage;
  const liqPrice = price && leverage > 0 ? price * (1 - 1 / leverage) : 0;

  useEffect(() => {
    if (!isManualPriceInput && orderType === "limit") {
      setPrice(markPrice);
    }
  }, [markPrice, orderType, isManualPriceInput]);

  const handleSliderChange = (value: number[]) => {
    const pct = value[0];
    setPercent(pct);

    const currentPrice = price || markPrice;
    if (!currentPrice || currentPrice <= 0 || !availableFunds) {
      setAmount(0);
      return;
    }

    const usdValue = (availableFunds * pct) / 100;

    let qty = usdValue / currentPrice;

    const lotSize = 0.0001;
    qty = Math.floor(qty / lotSize) * lotSize;

    setAmount(qty);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualPriceInput(true);
    setPrice(Number(e.target.value));
  };
  const handleSubmit = async () => {
    console.log("Placing order:", {
      symbol,
      side,
      orderType,
      price,
      amount,
      leverage,
    });

    await placeOrder({
      symbol: "BTC-PERP",
      side,
      orderType,
      price,
      size: amount,
      leverage,
    });
  };

  return (
    <div className="bg-background border border-border overflow-hidden flex flex-col">
      <div className="flex gap-2 justify-between items-center p-2 border-b border-border text-sm">
        <div className="flex items-center gap-2">
          <MarginModeSelector
            value={marginMode}
            onChange={(val) => setMarginMode(val)}
          />
          <LeverageSelector
            value={leverage}
            onChange={(val) => setLeverage(val)}
          />
        </div>

        <Select value={orderType} onValueChange={(v) => setOrderType(v as any)}>
          <SelectTrigger className="flex-1 text-xs border-border">
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
        <div className="px-3 py-2 space-y-1.5">
          <label
            htmlFor="price"
            className="text-xs text-muted-foreground block"
          >
            Price (USDC)
          </label>

          <div className="flex items-center h-full gap-2">
            <Input
              id="price"
              type="number"
              inputMode="decimal"
              value={typeof price === "number" && !isNaN(price) ? price : ""}
              onChange={(e) => {
                const val = e.target.value;
                setPrice(val === "" ? 0 : Number(val));
              }}
              placeholder={
                typeof markPrice === "number" && !isNaN(markPrice)
                  ? markPrice.toFixed(2)
                  : "0"
              }
              className={cn(
                "font-mono text-right text-sm bg-muted/40 border border-border/50 flex-1 focus-visible:ring-0 focus-visible:border-primary",
                "[appearance:textfield]",
                "[&::-webkit-outer-spin-button]:appearance-none",
                "[&::-webkit-inner-spin-button]:appearance-none"
              )}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={() => setPrice(Number(markPrice?.toFixed(2)))}
              className="h-9 text-[11px] font-semibold bg-muted/40 border border-border/50 text-primary hover:bg-muted"
            >
              Mark
            </Button>
          </div>
        </div>
      )}

      <div className="px-3 py-2">
        <div className="flex justify-between mb-1 text-xs text-muted-foreground">
          <span>Amount</span>
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
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="reduce" />
            <Label htmlFor="reduce" className="text-xs text-muted-foreground">
              Reduce
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tpsl" />
            <Label htmlFor="tpsl" className="text-xs text-muted-foreground">
              TP/SL
            </Label>
          </div>
        </div>
      </div>

      {/* <div className="p-3 bg-muted/10 text-center text-xs border-t border-border">
        <p className="text-muted-foreground mb-2">
          You need funds to start trading. Deposit now to get started.
        </p>
        <Button className="bg-[#ff6940] hover:bg-[#ff6940] w-full rounded-md">
          Deposit
        </Button>
      </div> */}

      <div className="p-3 border-t border-border text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Est Liq:</span>
          <span className="font-mono">
            {liqPrice ? `$${liqPrice.toFixed(2)}` : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Val:</span>
          <span className="font-mono">
            {orderValue ? `$${orderValue.toFixed(2)}` : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Margin Req:</span>
          <span className="font-mono">
            {marginReq ? `$${marginReq.toFixed(2)}` : "-"}
          </span>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          disabled={isPlacing || percent === 0}
          onClick={handleSubmit}
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

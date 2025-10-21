"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useMarkPrice } from "@/hooks/useMarkPrice";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { getMarkPrice } from "@/lib/getMarkPrice";
import { cn } from "@/lib/utils";
import { useUserState } from "@/store/useUserState";
import { useEffect, useState } from "react";
import { LeverageSelector } from "./LeverageSelector";
import { MarginModeSelector } from "./MarginModeSelector";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface TradeFormProps {
  symbol: string;
}

export default function TradeForm({ symbol }: TradeFormProps) {
  const { placeOrder, isPlacing } = usePlaceOrder();
  const markPrice = useMarkPrice(symbol.split("-")[0]);
  const availableFunds = useUserState((s) => s.availableFunds);
  const getPositionSize = useUserState((s) => s.getPositionSize);
  const currentPos = getPositionSize(symbol.split("-")[0]);

  const [marginMode, setMarginMode] = useState<"cross" | "isolated">(
    "isolated"
  );
  const [leverage, setLeverage] = useState(20);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"long" | "short">("long");
  const [price, setPrice] = useState<number>(markPrice);
  const [priceInput, setPriceInput] = useState<string>(markPrice.toFixed(2));
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [tokenValueInput, setTokenValueInput] = useState<string>("");
  const [usdcValueInput, setUsdcValueInput] = useState<string>("");
  const [isManualPriceInput, setIsManualPriceInput] = useState(false);
  const [isReduceOnly, setIsReduceOnly] = useState(false);

  const orderValue =
    tokenValueInput !== "" ? (price ?? markPrice) * (amount ?? 0) : 0;
  const marginReq = orderValue / leverage;
  const liqPrice = (() => {
    if (tokenValueInput === "") return 0;
    if (!price || leverage <= 0 || amount <= 0) return 0;

    // Tỷ lệ Maintenance Margin Rate (MMR) - GIẢ ĐỊNH 0.5% - CẦN CÓ GIÁ TRỊ THỰC TẾ CỦA SÀN
    const MMR = 0.005;
    const initialMargin = orderValue / leverage;

    if (marginMode === "isolated") {
      const factor = 1 / leverage; // (1 / Leverage) = % thua lỗ tối đa trước khi thanh lý

      if (side === "long") {
        return price * (1 - factor); // Long: Giá vào * (1 - 1/Đòn bẩy)
      } else {
        return price * (1 + factor); // Short: Giá vào * (1 + 1/Đòn bẩy)
      }
    } else {
      // marginMode === "cross"
      const maintenanceMargin = orderValue * MMR;

      // Quỹ Dự trữ Margin = Available Funds (Toàn bộ số dư) + Initial Margin (Ký quỹ ban đầu) - Maintenance Margin
      const marginReserve = availableFunds + initialMargin - maintenanceMargin;

      if (side === "long") {
        // Long: Giá Thanh lý = Giá vào - (Quỹ Dự trữ Margin / Kích thước lệnh)
        const diffPrice = marginReserve / amount;
        return price - diffPrice;
      } else {
        // Short: Giá Thanh lý = Giá vào + (Quỹ Dự trữ Margin / Kích thước lệnh)
        const diffPrice = marginReserve / amount;
        return price + diffPrice;
      }
    }
  })();

  useEffect(() => {
    if (!isManualPriceInput && orderType === "limit") {
      setPrice(markPrice);
      setPriceInput(markPrice.toFixed(2));
    }
  }, [markPrice, orderType, isManualPriceInput]);

  useEffect(() => {
    setPercent(0);
    setUsdcValueInput("");
    setTokenValueInput("");
  }, [symbol]);

  useEffect(() => {
    if (percent > 0) {
      const maxTradeValue = availableFunds * leverage;
      const newPercent = (Number(usdcValueInput) / maxTradeValue) * 100;
      handleSliderChange([newPercent]);
    }
  }, [leverage, availableFunds, price, markPrice, usdcValueInput]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setTokenValueInput(inputValue);

      const val = Number(inputValue);

      if (isNaN(val) || val < 0) {
        setAmount(0);
        setUsdcValueInput("");
        return;
      }

      setAmount(val);

      const currentPrice = price || markPrice;
      if (currentPrice > 0 && availableFunds > 0) {
        const usdValue = val * currentPrice;

        setUsdcValueInput(usdValue.toFixed(2));

        const maxTradeValue = availableFunds * leverage;
        const newPercent = (usdValue / maxTradeValue) * 100;

        setPercent(Math.min(newPercent, 100));
      } else {
        setPercent(0);
        setUsdcValueInput("");
      }
    }
  };

  const handleUSDCValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setUsdcValueInput(inputValue);

      const usdValue = Number(inputValue);

      if (isNaN(usdValue) || usdValue < 0) {
        setAmount(0);
        setTokenValueInput("");
        return;
      }

      const currentPrice = price || markPrice;
      if (currentPrice > 0) {
        let qty = usdValue / currentPrice;
        const lotSize = 0.0001;
        qty = Math.floor(qty / lotSize) * lotSize;

        setAmount(qty);
        setTokenValueInput(qty.toFixed(5));

        if (availableFunds > 0) {
          const maxTradeValue = availableFunds * leverage;
          const newPercent = (usdValue / maxTradeValue) * 100;

          setPercent(Math.min(newPercent, 100));
        } else {
          setPercent(0);
        }
      } else {
        setAmount(0);
        setPercent(0);
        setTokenValueInput("");
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    const pct = value[0];
    setPercent(pct);

    const currentPrice = price || markPrice;
    if (!currentPrice || currentPrice <= 0 || !availableFunds) {
      setAmount(0);
      setTokenValueInput("");
      setUsdcValueInput("");
      return;
    }

    const maxTradeValue = availableFunds * leverage;
    const usdValue = (maxTradeValue * pct) / 100;

    let qty = usdValue / currentPrice;

    const lotSize = 0.0001;
    qty = Math.floor(qty / lotSize) * lotSize;

    setAmount(qty);
    setTokenValueInput(qty.toFixed(5));

    const actualOrderValue = qty * currentPrice;
    setUsdcValueInput(actualOrderValue.toFixed(2));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualPriceInput(true);
    const inputValue = e.target.value;

    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setPriceInput(inputValue);

      const val = Number(inputValue);
      setPrice(val);
    }
  };

  const handleMarkButtonClick = async () => {
    const price = await getMarkPrice(symbol.split("-")[0]);
    if (price) {
      setPrice(Number(price?.toFixed(2)));
      setPriceInput(price?.toFixed(2) || "0");
    }
  };

  const handleSubmit = async () => {
    await placeOrder({
      symbol: `${symbol.split("-")[0]}-PERP`,
      side,
      // orderType,
      price,
      size: amount,
      reduceOnly: isReduceOnly,
    });
  };

  const handleReduceChange = (checked: boolean) => {
    setIsReduceOnly(checked);
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
            symbol={symbol.split("-")[0]}
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
            <span className="font-mono">
              {currentPos.toFixed(5)}{" "}
              {symbol.replace("-PERP", "").replace("-USD", "")}
            </span>
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
              type="text"
              inputMode="decimal"
              value={priceInput}
              lang="en"
              onChange={handlePriceChange}
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
              onClick={handleMarkButtonClick}
              className="h-9 text-[11px] font-semibold bg-muted/40 border border-border/50 text-primary hover:bg-muted"
            >
              Mark
            </Button>
          </div>
        </div>
      )}

      <div className="px-3 py-2 ">
        <div className="flex items-center border border-border/50 rounded-md bg-muted/40 overflow-hidden">
          <Input
            id="amount-btc"
            type="text"
            inputMode="decimal"
            value={tokenValueInput}
            onChange={handleAmountChange}
            placeholder="0"
            className={cn(
              "font-mono text-left text-sm bg-transparent border-none flex-1 focus-visible:ring-0",
              "[appearance:textfield]",
              "[&::-webkit-outer-spin-button]:appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
          <span className="text-sm px-2 text-muted-foreground border-r-4 border-border/50">
            {symbol.split("-")[0]}
          </span>

          <Input
            id="amount-usdc"
            type="text"
            inputMode="decimal"
            value={usdcValueInput}
            onChange={handleUSDCValueChange}
            placeholder="0"
            className={cn(
              "font-mono text-right text-sm bg-transparent border-none flex-1 focus-visible:ring-0",
              "[appearance:textfield]",
              "[&::-webkit-outer-spin-button]:appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
          <span className="text-sm px-2 text-muted-foreground">USDC</span>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="flex justify-between mb-1 text-xs text-muted-foreground">
          <span>Amount</span>
          <span>{percent.toFixed(0)}%</span>
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
            <Checkbox
              id="reduce"
              checked={isReduceOnly}
              onCheckedChange={handleReduceChange}
            />
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
            {liqPrice > 0
              ? `$${liqPrice.toFixed(2)}`
              : liqPrice === 0
              ? "$0.00"
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Val:</span>
          <span className="font-mono">
            {orderValue > 0
              ? `$${orderValue.toFixed(2)}`
              : orderValue === 0
              ? "$0.00"
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Margin Req:</span>
          <span className="font-mono">
            {marginReq > 0
              ? `$${marginReq.toFixed(2)}`
              : marginReq === 0
              ? "$0.00"
              : "-"}
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

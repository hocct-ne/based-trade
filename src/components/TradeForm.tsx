"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

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
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState([25]);
  const [price, setPrice] = useState(markPrice.toString());
  const [amount, setAmount] = useState("");

  const handlePlaceOrder = () => {
    console.log("Placing order:", {
      orderType,
      side,
      leverage: leverage[0],
      price,
      amount,
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-3 border-b border-border">
        <Tabs
          value={orderType}
          onValueChange={(v) => setOrderType(v as any)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="limit" data-testid="tab-limit-order">
              Limit
            </TabsTrigger>
            <TabsTrigger value="market" data-testid="tab-market-order">
              Market
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant={side === "long" ? "default" : "outline"}
            className={side === "long" ? "bg-success hover:bg-success/90" : ""}
            onClick={() => setSide("long")}
            data-testid="button-long"
          >
            Long
          </Button>
          <Button
            variant={side === "short" ? "default" : "outline"}
            className={side === "short" ? "bg-danger hover:bg-danger/90" : ""}
            onClick={() => setSide("short")}
            data-testid="button-short"
          >
            Short
          </Button>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-auto">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-muted-foreground">Leverage</label>
            <span
              className="text-sm font-mono font-semibold"
              data-testid="text-leverage"
            >
              {leverage[0]}x
            </span>
          </div>
          <Slider
            value={leverage}
            onValueChange={setLeverage}
            min={1}
            max={125}
            step={1}
            className="mb-2"
            data-testid="slider-leverage"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1x</span>
            <span>125x</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Available Funds
          </label>
          <div className="font-mono text-sm" data-testid="text-available-funds">
            {availableFunds.toFixed(2)} USDC
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Current Position
          </label>
          <div
            className="font-mono text-sm"
            data-testid="text-current-position"
          >
            {currentPosition.toFixed(5)} {symbol.split("-")[0]}
          </div>
        </div>

        {orderType === "limit" && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Price (USDC)
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono text-right"
              data-testid="input-price"
            />
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Amount ({symbol.split("-")[0]})
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono text-right"
            placeholder="0.00"
            data-testid="input-amount"
          />
          <div className="flex gap-1 mt-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                className="flex-1 text-xs py-1 bg-accent hover-elevate rounded-md"
                onClick={() =>
                  setAmount(
                    ((availableFunds * pct) / 100 / markPrice).toFixed(5)
                  )
                }
                data-testid={`button-amount-${pct}`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Liq:</span>
            <span className="font-mono" data-testid="text-est-liq">
              $0
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Val:</span>
            <span className="font-mono" data-testid="text-order-value">
              $0.00
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin Req:</span>
            <span className="font-mono" data-testid="text-margin-req">
              $0.00
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          className={`w-full ${
            side === "long"
              ? "bg-success hover:bg-success/90"
              : "bg-danger hover:bg-danger/90"
          }`}
          onClick={handlePlaceOrder}
          data-testid="button-place-order"
        >
          {side === "long" ? "Long" : "Short"} {symbol.split("-")[0]}
        </Button>
      </div>
    </div>
  );
}

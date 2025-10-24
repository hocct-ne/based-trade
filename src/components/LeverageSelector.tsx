"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

interface LeverageSelectorProps {
  value: number;
  max?: number;
  onChange: (val: number) => void;
  symbol?: string;
}

export function LeverageSelector({
  value,
  onChange,
  max = 40,
  symbol,
}: LeverageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tempLev, setTempLev] = useState(value);

  useEffect(() => {
    setTempLev(value);
  }, [value]);

  const handleConfirm = () => {
    onChange(tempLev);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="text-[13px] rounded-md px-3 py-1"
        >
          {value}x
        </Button>
      </DialogTrigger>

      <DialogContent className=" bg-background border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            Adjust Leverage
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground text-center leading-snug">
            Control the leverage used for {symbol} positions. The maximum
            leverage is{" "}
            <span className="text-foreground font-medium">{max}x</span>.
          </p>

          <div className="flex items-center gap-3">
            <Slider
              min={1}
              max={max}
              step={1}
              value={[tempLev]}
              onValueChange={(val) => setTempLev(val[0])}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={tempLev}
                onChange={(e) =>
                  setTempLev(Math.min(Number(e.target.value), max))
                }
                className="w-12 bg-transparent border border-border/50 text-center text-sm rounded-md"
              />
              <span className="text-sm text-muted-foreground">x</span>
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Confirm
          </Button>

          <div className="text-xs text-center text-red-400 border border-red-400/40 bg-red-400/10 rounded-md p-2">
            Note that setting a higher leverage increases the risk of
            liquidation.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

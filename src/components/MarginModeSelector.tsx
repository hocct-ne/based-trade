"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function MarginModeSelector({
  value,
  onChange,
}: {
  value: "cross" | "isolated";
  onChange: (val: "cross" | "isolated") => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<"cross" | "isolated">(value);

  const handleConfirm = () => {
    onChange(selected);
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
          {value === "cross" ? "Cross" : "Isolated"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            BTC-USD Margin Mode
          </DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selected}
          onValueChange={(v) => setSelected(v as "cross" | "isolated")}
          className="space-y-3"
        >
          <div
            className={cn(
              "border rounded-lg p-3 cursor-pointer transition",
              selected === "cross"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/30"
            )}
            onClick={() => setSelected("cross")}
          >
            <div className="flex items-center space-x-2 mb-1">
              <RadioGroupItem value="cross" id="cross" />
              <Label htmlFor="cross" className="font-medium">
                Cross
              </Label>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              All cross positions share the same cross margin as collateral. In
              the event of liquidation, your cross margin balance and remaining
              open positions may be forfeited.
            </p>
          </div>

          {/* Isolated Option */}
          <div
            className={cn(
              "border rounded-lg p-3 cursor-pointer transition",
              selected === "isolated"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/30"
            )}
            onClick={() => setSelected("isolated")}
          >
            <div className="flex items-center space-x-2 mb-1">
              <RadioGroupItem value="isolated" id="isolated" />
              <Label htmlFor="isolated" className="font-medium">
                Isolated
              </Label>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Manage your risk per position by restricting margin allocation to
              each. If the margin ratio of an isolated position reaches 100%, it
              will be liquidated.
            </p>
          </div>
        </RadioGroup>

        <Button
          onClick={handleConfirm}
          className="mt-3 w-full bg-primary hover:bg-primary/90 text-white"
        >
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useClosePosition } from "@/hooks/useClosePosition";

interface ClosePositionDialogProps {
  symbol: string;
  size: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ClosePositionDialog({
  symbol,
  size,
  isOpen,
  onClose,
}: ClosePositionDialogProps) {
  const [percent, setPercent] = useState(100);
  const closePosition = useClosePosition();
  const closeBtnDisabled = size <= 0;

  const handleConfirm = async () => {
    await closePosition(symbol, percent / 100);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Market Close</DialogTitle>
          <p className="text-xs text-muted-foreground">
            This will attempt to immediately close the position.
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex justify-between text-sm">
            <span>Size</span>
            <span className="text-green-500">
              {(size * (percent / 100)).toFixed(5)} {symbol.split("-")[0]}
            </span>
          </div>

          <Slider
            value={[percent]}
            onValueChange={(v) => setPercent(v[0])}
            max={100}
            step={25}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={closeBtnDisabled}
          >
            Market Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

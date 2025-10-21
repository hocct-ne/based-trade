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
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [percent, setPercent] = useState(100);
  const closePosition = useClosePosition();
  const closeBtnDisabled = size <= 0 || isLoading;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await closePosition(symbol, percent / 100);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mpaax-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            Market Close
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            This will attempt to immediately close the position.
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex justify-between text-sm">
            <span>Size</span>
            <span className="text-[#50D2C1]">
              {(size * (percent / 100)).toFixed(5)} {symbol.split("-")[0]}
            </span>
          </div>

          <Slider
            value={[percent]}
            onValueChange={(v) => setPercent(v[0])}
            max={100}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {[0, 25, 50, 75, 100].map((p) => (
              <button
                key={p}
                onClick={() => setPercent(p)}
                className={cn(
                  "transition-colors",
                  "hover:text-foreground",
                  percent === p && "text-foreground font-medium"
                )}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={closeBtnDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Market Close"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

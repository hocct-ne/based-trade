"use client";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface AccountPanelProps {
  accountEquity: number;
  spotBalance: number;
  perpsBalance: number;
  unrealizedPnl: number;
  marginRatio: number;
  accountLeverage: number;
}

export default function AccountPanel({
  accountEquity,
  spotBalance,
  perpsBalance,
  unrealizedPnl,
  marginRatio,
  accountLeverage,
}: AccountPanelProps) {
  return (
    <div className="bg-card p-4 space-y-4 overflow-auto w-full h-full">
      <div>
        <div className="text-sm text-muted-foreground mb-1">Account Equity</div>
        <div
          className="text-2xl font-bold font-mono"
          data-testid="text-account-equity"
        >
          ${accountEquity.toFixed(2)}
        </div>
        <div className="flex gap-2 mt-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Spot: </span>
            <span className="font-mono" data-testid="text-spot-balance">
              ${spotBalance.toFixed(2)}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Perps: </span>
            <span className="font-mono" data-testid="text-perps-balance">
              ${perpsBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="text-sm font-semibold mb-2">Perps Overview</div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance</span>
          <span className="font-mono" data-testid="text-perps-overview-balance">
            ${perpsBalance.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Unrealized PNL</span>
          <span
            className={`font-mono ${
              unrealizedPnl >= 0 ? "text-success" : "text-danger"
            }`}
            data-testid="text-unrealized-pnl"
          >
            {unrealizedPnl >= 0 ? "+" : ""}${unrealizedPnl.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cross Margin Ratio</span>
          <span className="font-mono" data-testid="text-margin-ratio">
            {marginRatio.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Account Leverage</span>
          <span className="font-mono" data-testid="text-account-leverage">
            {accountLeverage.toFixed(2)}x
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1 gap-2"
          variant="default"
          data-testid="button-deposit"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Deposit
        </Button>
        <Button
          className="flex-1 gap-2"
          variant="outline"
          data-testid="button-withdraw"
        >
          <ArrowUpFromLine className="h-4 w-4" />
          Withdraw
        </Button>
      </div>
    </div>
  );
}

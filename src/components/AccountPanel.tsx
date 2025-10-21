"use client";
import { Button } from "@/components/ui/button";
import { useUserState } from "@/store/useUserState";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function AccountPanel() {
  const prices = {
    BTC: 108000,
    ETH: 3854,
    USOL: 184.78,
    USDC: 1,
  };
  const allBalances = useUserState((s) => s.allBalances);
  const positions = useUserState((s) => s.positions);

  let spotBalance = 0;
  let perpsBalance = 0;

  allBalances.forEach((b) => {
    const rate = prices[b.unit as keyof typeof prices] ?? 1;
    const valueInUSDC = parseFloat(b.total) * rate;

    if (b.type === "SPOT") {
      spotBalance += valueInUSDC;
    } else if (b.type === "PERP") {
      perpsBalance += valueInUSDC;
    }
  });

  const unrealizedPnl = positions.reduce(
    (sum, p) => sum + (p.position?.unrealizedPnl ?? 0),
    0
  );
  const totalMarginUsed = positions.reduce(
    (sum, p) => sum + (p.position?.marginUsed ?? 0),
    0
  );

  const totalPositionValue = positions.reduce(
    (sum, p) => sum + Math.abs(p.position?.positionValue ?? 0),
    0
  );

  const accountEquity = spotBalance + perpsBalance + unrealizedPnl;

  const accountLeverage =
    accountEquity > 0 ? totalPositionValue / accountEquity : 0;

  const marginRatio =
    accountEquity > 0 ? (totalMarginUsed / accountEquity) * 100 : 0;

  return (
    <div className="bg-card p-4 space-y-4 overflow-auto w-full h-full">
      <div>
        <div className="text-sm text-muted-foreground mb-1">Account Equity</div>
        <div className="text-2xl font-bold" data-testid="text-account-equity">
          ${accountEquity.toFixed(2)}
        </div>
        <div className="flex gap-2 mt-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Spot: </span>
            <span className="" data-testid="text-spot-balance">
              ${spotBalance.toFixed(2)}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Perps: </span>
            <span className="" data-testid="text-perps-balance">
              ${perpsBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="text-sm font-semibold mb-2">Perps Overview</div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance</span>
          <span className="" data-testid="text-perps-overview-balance">
            ${perpsBalance.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Unrealized PNL</span>
          <span
            className={` ${
              unrealizedPnl >= 0 ? "text-success" : "text-danger"
            }`}
            data-testid="text-unrealized-pnl"
          >
            {unrealizedPnl >= 0 ? "+" : ""}${unrealizedPnl.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cross Margin Ratio</span>
          <span className="" data-testid="text-margin-ratio">
            {marginRatio.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Account Leverage</span>
          <span className="" data-testid="text-account-leverage">
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

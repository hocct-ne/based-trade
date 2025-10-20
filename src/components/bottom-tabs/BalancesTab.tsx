"use client";
import { Button } from "@/components/ui/button";

export default function BalancesTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground border-b border-border">
          <tr>
            <th className="text-left pb-2">Coin</th>
            <th className="text-right pb-2">Total Balance</th>
            <th className="text-right pb-2">Available Balance</th>
            <th className="text-right pb-2">USDC Value</th>
            <th className="text-right pb-2">PNL (ROE %)</th>
            <th className="text-right pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border hover-elevate">
            <td className="py-3" data-testid="text-coin">
              USDC (Perps)
            </td>
            <td
              className="text-right font-mono"
              data-testid="text-total-balance"
            >
              0.00000000
            </td>
            <td
              className="text-right font-mono"
              data-testid="text-available-balance"
            >
              0.00000000
            </td>
            <td className="text-right font-mono">0.00</td>
            <td className="text-right font-mono">-</td>
            <td className="text-right">
              <Button variant="ghost" size="sm" data-testid="button-transfer">
                Transfer
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

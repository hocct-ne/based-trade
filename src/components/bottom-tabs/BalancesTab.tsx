"use client";
import { useUserState } from "@/store/useUserState";
import { Button } from "@/components/ui/button";

export default function BalancesTab() {
  const allBalances = useUserState((s) => s.allBalances);
  const markPrices = useUserState((s) => s.markPrices);

  return (
    <div className="overflow-x-auto text-[12px]!">
      <table className="w-full">
        <thead className="text-muted-foreground border-b border-border">
          <tr>
            <th className="w-[150px] text-left pb-2">Coin</th>
            <th className="w-[150px] text-right pb-2">Total Balance</th>
            <th className="w-[150px] text-right pb-2">Available Balance</th>
            <th className="w-[150px] text-right pb-2">USDC Value</th>
            <th className="w-[150px] text-right pb-2">PNL (ROE %)</th>
            <th className="text-right pb-2">Send</th>
          </tr>
        </thead>
        <tbody>
          {allBalances.map((b) => (
            <tr
              key={b.coin}
              className="border-b border-border hover:bg-muted/20"
            >
              <td className="py-2 font-semibold">{b.coin}</td>
              <td className="text-right">
                {b.total} {b.unit}
              </td>
              <td className="text-right">
                {b.availableBalance} {b.unit}
              </td>
              <td className="text-right">
                {b.usdcValue ? b.usdcValue : ""} {b.unit}
              </td>
              <td className="text-right">-</td>
              <td className="text-right">
                <Button variant="ghost" size="sm"></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

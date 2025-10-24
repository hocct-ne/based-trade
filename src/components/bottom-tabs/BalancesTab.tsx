"use client";
import { Button } from "@/components/ui/button";
import { useUserState } from "@/store/useUserState";

export default function BalancesTab() {
  const allBalances = useUserState((s) => s.allBalances);

  return (
    <div className="overflow-x-auto text-[12px]!">
      <table className="w-full">
        <thead className="text-muted-foreground border-b border-border">
          <tr>
            <th className="text-left pb-2">Coin</th>
            <th className="text-right pb-2">Total Balance</th>
            <th className="text-right pb-2">Available Balance</th>
            <th className="text-right pb-2">USDC Value</th>
            <th className="text-right pb-2">PNL (ROE %)</th>
            <th className="min-w-[100px] text-right pb-2">Send</th>
          </tr>
        </thead>
        <tbody>
          {allBalances.map((b) => {
            return (
              <tr
                key={b.coin}
                className="border-b border-border hover:bg-muted/20"
              >
                <td className="py-2 font-semibold">{b.coin}</td>
                <td className="text-right">
                  {Number(b.total).toLocaleString()} {b.unit}
                </td>
                <td className="text-right">
                  {Number(b.availableBalance).toLocaleString()} {b.unit}
                </td>
                <td className="text-right">
                  {b.usdcValue
                    ? `$${Number(b.usdcValue).toLocaleString()}`
                    : ""}{" "}
                  {b.unit}
                </td>
                <td className="text-right">-</td>
                <td className="text-right">
                  <Button variant="ghost" size="sm"></Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

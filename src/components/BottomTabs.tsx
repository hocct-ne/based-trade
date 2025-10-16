"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function BottomTabs() {
  return (
    <div className="flex-1 bg-card border-t p-2 border-r border-border overflow-auto h-full">
      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-border h-10 p-0">
          <TabsTrigger
            value="balances"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-balances"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="positions"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-positions"
          >
            Positions(0)
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-open-orders"
          >
            Open Orders(0)
          </TabsTrigger>
          <TabsTrigger
            value="trade-history"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-trade-history"
          >
            Trade History
          </TabsTrigger>
          <TabsTrigger
            value="order-history"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-order-history"
          >
            Order History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="p-2 min-h-[200px]">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-transfer"
                    >
                      Transfer
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="p-2">
          <div
            className="text-sm text-muted-foreground text-center py-8"
            data-testid="text-no-positions"
          >
            No open positions
          </div>
        </TabsContent>

        <TabsContent value="orders" className="p-2">
          <div
            className="text-sm text-muted-foreground text-center py-8"
            data-testid="text-no-orders"
          >
            No open orders
          </div>
        </TabsContent>

        <TabsContent value="trade-history" className="p-2">
          <div className="text-sm text-muted-foreground text-center py-8">
            No trade history
          </div>
        </TabsContent>

        <TabsContent value="order-history" className="p-2">
          <div className="text-sm text-muted-foreground text-center py-8">
            No order history
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

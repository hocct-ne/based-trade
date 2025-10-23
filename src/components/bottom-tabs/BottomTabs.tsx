"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BalancesTab from "./BalancesTab";
import PositionsTab from "./PositionsTab";
import TradeHistoryTab from "./TradeHistoryTab";
import OrderHistoryTab from "./OrderHistoryTab";
import { useUserState } from "@/store/useUserState";
import { OrdersTab } from "./OrdersTab";

export default function BottomTabs() {
  const positions = useUserState((s) => s.positions);
  const allBalances = useUserState((s) => s.allBalances);
  const openOrders = useUserState((s) => s.openOrders);
  // console.log("all", allBalances);

  return (
    <div className="flex-1 bg-card border-t p-2 border-r border-border overflow-auto h-full text-[12px]!">
      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-border h-10 p-0">
          <TabsTrigger
            value="balances"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-balances"
          >
            Balances ({allBalances.length})
          </TabsTrigger>
          <TabsTrigger
            value="positions"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-positions"
          >
            Positions({positions.length})
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-none data-[state=active]:bg-accent"
            data-testid="tab-open-orders"
          >
            Open Orders({openOrders.length})
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
          <BalancesTab />
        </TabsContent>
        <TabsContent value="positions" className="p-2">
          <PositionsTab />
        </TabsContent>
        <TabsContent value="orders" className="p-2">
          <OrdersTab />
        </TabsContent>
        <TabsContent value="trade-history" className="p-2">
          <TradeHistoryTab />
        </TabsContent>
        <TabsContent value="order-history" className="p-2">
          <OrderHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

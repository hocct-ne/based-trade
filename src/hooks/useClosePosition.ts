// hooks/useClosePosition.ts
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useUserState } from "@/store/useUserState";

export function useClosePosition() {
  const { placeOrder } = usePlaceOrder();
  const positions = useUserState((s) => s.positions);

  return async (symbol: string, percent: number = 1) => {
    const pos = positions.find((p) => p.position.coin === symbol);
    if (!pos) return;

    const side = pos.position.szi > 0 ? "short" : "long";
    const size = Math.abs(pos.position.szi) * percent;

    await placeOrder({
      symbol,
      side,
      size,
      orderType: "market",
      reduceOnly: true,
    });
  };
}

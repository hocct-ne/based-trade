import { useEffect, useState } from "react";
import { getMarkPrice } from "@/lib/getMarkPrice";

export function useMarkPrice(symbol: string) {
  const [markPrice, setMarkPrice] = useState<number>(0);

  useEffect(() => {
    async function fetchMark() {
      const price = await getMarkPrice(symbol);
      if (price) {
        setMarkPrice(price);
      }
    }
    fetchMark();
  }, [symbol]);

  return markPrice;
}

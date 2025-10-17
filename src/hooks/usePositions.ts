"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/hyperClient";

export interface Position {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  margin: number;
  pnl: number;
  liqPrice: number;
}

export function usePositions(userAddress?: string) {
  const [positions, setPositions] = useState<Position[]>([]);

  // 🔹 Lấy danh sách positions ban đầu
  useEffect(() => {
    if (!userAddress) return;

    async function fetchPositions() {
      try {
        const pos = await client.info.getUserPositions(userAddress);
        if (Array.isArray(pos)) setPositions(pos);
      } catch (err) {
        console.error("❌ Error fetching positions:", err);
      }
    }

    fetchPositions();

    // 🔹 Lắng nghe realtime user state
    const unsub = client.info.subscribeToUserState(
      userAddress,
      (state) => {
        if (state?.positions) setPositions(state.positions);
      }
    );

    return () => unsub?.();
  }, [userAddress]);

  // 🔹 Cập nhật local khi có position mới
  function addPosition(pos: Position) {
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === pos.symbol);
      if (existing) {
        const totalSize = existing.size + pos.size;
        const newEntryPrice =
          (existing.entryPrice * existing.size + pos.entryPrice * pos.size) /
          totalSize;
        return prev.map((p) =>
          p.symbol === pos.symbol
            ? { ...p, size: totalSize, entryPrice: newEntryPrice }
            : p
        );
      }
      return [...prev, pos];
    });
  }

  return { positions, addPosition };
}

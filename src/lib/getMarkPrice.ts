"use client";
import { client } from "@/lib/hyperClient";

export async function getMarkPrice(symbol: string) {
  try {
    const mids = await client.info.getAllMids();
    if (!mids) return null;

    const upper = symbol.toUpperCase();

    if (mids[upper] !== undefined) {
      console.log(`📊 Found exact key: ${upper}`);
      return Number(mids[upper]);
    }

    if (mids[`${upper}-PERP`] !== undefined) {
      console.log(`📊 Fallback key: ${upper}-PERP`);
      return Number(mids[`${upper}-PERP`]);
    }

    const foundKey = Object.keys(mids).find((k) =>
      k.toUpperCase().includes(upper)
    );
    if (foundKey) {
      console.log(`📊 Fallback match key: ${foundKey}`);
      return Number(mids[foundKey]);
    }

    console.warn(`⚠️ No mark price found for ${symbol}`);
    return null;
  } catch (err) {
    console.error("❌ Failed to fetch mark price:", err);
    return null;
  }
}

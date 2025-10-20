// hooks/useUserSnapshot.ts
"use client";
import { useEffect } from "react";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { nextConfig } from "@/config";

export function useUserSnapshot() {
  const updateFromFeed = useUserState((s) => s.updateFromFeed);

  useEffect(() => {
    const load = async () => {
      if (!nextConfig.nextWalletAddress) return;
      try {
        const clearing = await client.info.perpetuals.getClearinghouseState(
          nextConfig.nextWalletAddress
        );
        

        updateFromFeed({
          clearinghouseState: clearing,
        });
      } catch (e) {
        console.error("❌ Failed to fetch user snapshot:", e);
      }
    };

    load();
  }, [nextConfig.nextWalletAddress]);
}

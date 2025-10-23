import { useEffect, useState } from "react";
import { getMarkPrice } from "@/lib/getMarkPrice";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { AllMids } from "@coin98-hyper/core";
import { useAppState } from "@/store/useAppState";

export function useMarkPriceWs() {
  const isConnected = useAppState((s) => s.isConnected);

  useEffect(() => {
    if (!isConnected) return;

    client.subscriptions.subscribeToAllMids((mids) => {
      useUserState.getState().updateMarkPrices(mids as AllMids);
    });

    return () => {
      client.subscriptions.unsubscribeFromAllMids();
    };
  }, [isConnected]);
}

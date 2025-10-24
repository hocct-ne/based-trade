import { client } from "@/lib/hyperClient";
import { useAppState } from "@/store/useAppState";
import { useUserState } from "@/store/useUserState";
import { AllMids } from "@coin98-hyper/core";
import { useEffect } from "react";

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

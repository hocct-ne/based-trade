import { useEffect, useState } from "react";
import { getMarkPrice } from "@/lib/getMarkPrice";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { AllMids } from "@coin98-hyper/core";

export function useMarkPriceWs() {
  useEffect(() => {
    client.subscriptions.subscribeToAllMids((mids) => {
      useUserState.getState().updateMarkPrices(mids as AllMids);
    });

    return () => {
      client.subscriptions.unsubscribeFromAllMids();
    };
  }, []);
}

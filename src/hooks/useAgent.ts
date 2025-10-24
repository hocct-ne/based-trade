"use client";

import { ethers, TypedDataDomain, TypedDataField, Wallet } from "ethers";
import { client } from "@/lib/hyperClient";
import { useUserState } from "@/store/useUserState";
import { nextConfig } from "@/config";

export const signTypedData = async (data: {
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  message: Record<string, any>;
}) => {
  const wallet = new ethers.Wallet(nextConfig.nextApiKey!);
  // console.log(wallet, nextConfig.nextApiKey);

  const signature = await wallet.signTypedData(
    data.domain,
    data.types,
    data.message
  );
  return signature;
};

export function useAgent() {
  const agent = useUserState((s) => s.agent);
  const setAgent = useUserState((s) => s.setAgent);

  const ensureAgent = async () => {
    let w = agent;

    if (!w) {
      const newWallet = Wallet.createRandom();
      setAgent({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
      });
      w = newWallet;
    }

    const { action, signingData } = await client.exchange.prepareApproveAgent({
      agentAddress: w.address,
      agentName: "C98 Hyperliquid",
    });

    const sigMess = await signTypedData(signingData);
    await client.exchange.approveAgent(action, sigMess);

    return w;
  };

  return { ensureAgent };
}

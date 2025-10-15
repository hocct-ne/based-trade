"use client";
import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import MarketTicker from "@/components/MarketTicker";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import TradeForm from "@/components/TradeForm";
import BottomTabs from "@/components/BottomTabs";
import AccountPanel from "@/components/AccountPanel";
import SettingsModal from "@/components/SettingsModal";
import WalletConnectModal from "@/components/WalletConnectModal";
import { Hyperliquid } from "@coin98-hyper/core";

// Mock data generators
const generateMockOrders = (
  basePrice: number,
  count: number,
  isBid: boolean
) => {
  return Array.from({ length: count }, (_, i) => {
    const price = isBid ? basePrice - i * 10 : basePrice + i * 10;
    const amount = Math.random() * 5;
    const total = amount * (i + 1);
    return { price, amount, total };
  });
};

const sdk = Hyperliquid.createInstane({});

export default function TradingPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState("BTC-USD");

  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress(undefined);
    } else {
      setWalletModalOpen(true);
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setWalletConnected(true);
  };

  // Mock market data
  const markPrice = 114915;
  const basePrice = 114915;

  return (
    <div className="flex flex-col bg-background">
      <Header
        onConnectWallet={handleConnectWallet}
        onOpenSettings={() => setSettingsOpen(true)}
        isWalletConnected={walletConnected}
        walletAddress={walletAddress}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-col min-h-220 ">
            <div>
              <MarketTicker
                pair={selectedPair}
                markPrice={markPrice}
                change24h={4932.5}
                change24hPercent={4.48}
                volume24h={4000049102}
                openInterest={2843769121}
                fundingRate={0.000013}
                fundingCountdown="49:30"
                onPairChange={setSelectedPair}
              />
            </div>
            <TradingChart symbol={selectedPair} />
          </div>

          <div className="flex-1 min-h-[240px] border-t border-border overflow-auto">
            <BottomTabs />
          </div>
        </div>
        <div className="w-[300px] hidden lg:block">
          <OrderBook
            bids={generateMockOrders(basePrice, 20, true)}
            asks={generateMockOrders(basePrice + 10, 20, false)}
            spread={10}
            spreadPercent={0.01}
          />
        </div>

        <div className="w-[320px] hidden lg:flex flex-col">
          <div className="flex-1 overflow-auto">
            <TradeForm
              symbol={selectedPair}
              availableFunds={walletConnected ? 10000 : 0}
              currentPosition={0}
              markPrice={markPrice}
            />
          </div>

          <div className="border-t border-border">
            <AccountPanel
              accountEquity={walletConnected ? 10000 : 0}
              spotBalance={0}
              perpsBalance={walletConnected ? 10000 : 0}
              unrealizedPnl={0}
              marginRatio={0}
              accountLeverage={0}
            />
          </div>
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <WalletConnectModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}

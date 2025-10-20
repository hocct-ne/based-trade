"use client";
import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import MarketTicker from "@/components/MarketTicker";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import TradeForm from "@/components/TradeForm";
import BottomTabs from "@/components/bottom-tabs/BottomTabs";
import AccountPanel from "@/components/AccountPanel";
import SettingsModal from "@/components/SettingsModal";
import WalletConnectModal from "@/components/WalletConnectModal";
import { Hyperliquid } from "@coin98-hyper/core";

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

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <Header
        onConnectWallet={handleConnectWallet}
        onOpenSettings={() => setSettingsOpen(true)}
        isWalletConnected={walletConnected}
        walletAddress={walletAddress}
      />

      <div className="grid grid-cols-[1fr_350px_400px] grid-rows-[600px_350px] overflow-hidden flex-1">
        <div className="col-start-1 row-start-1 flex flex-col min-w-0 border-r border-border">
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
            {/* <TradingChart symbol={selectedPair} /> */}
          </div>
        </div>

        <div className="col-start-2 row-start-1 border-r border-border overflow-auto">
          <OrderBook />
        </div>

        <div className="col-start-3 row-start-1 overflow-auto">
          <TradeForm symbol={selectedPair} />
        </div>

        <div className="col-span-2 row-start-2 border-t border-border overflow-auto">
          <BottomTabs />
        </div>

        <div className="col-start-3 row-start-2 border-t border-border overflow-auto">
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

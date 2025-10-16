"use client";

import { Button } from "@/components/ui/button";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown, Settings } from "lucide-react";
// import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwicher";

interface HeaderProps {
  onConnectWallet: () => void;
  onOpenSettings: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

export default function Header({
  onConnectWallet,
  onOpenSettings,
  isWalletConnected,
  walletAddress,
}: HeaderProps) {
  const navItemsText = ["Perps", "Spot", "Affiliate"];
  const navItemsDropDown = ["Ecosystem", "Trading", "Portfolio"];
  // const t = useTranslations();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  return (
    <header className="h-[60px] border-b border-border bg-card flex items-center justify-between px-4 gap-6">
      <div className="flex items-center gap-6">
        <Image
          src="/logoNEWhite.ecbc8381.png"
          width={100}
          height={20}
          alt="Based logo"
        />
        <nav className="hidden md:flex items-center gap-4 !text-[13px] !leading-4 font-medium">
          {navItemsText.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
              }}
              className={`text-muted-foreground hover-elevate hover:text-primary px-3 py-1.5 rounded-md transition-colors ${
                activeNav === item ? "text-primary" : ""
              }`}
              data-testid={`link-${item.toLowerCase()}`}
            >
              {item}
            </button>
          ))}
          <NavigationMenu.Root className="relative z-50 flex justify-center">
            <NavigationMenu.List className="flex space-x-6 ">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className=" hover:text-primary transition flex items-center gap-1 text-muted-foreground ">
                  Ecosystem <ChevronDown className="w-4 h-4" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-3 w-56">
                  <ul className="space-y-2 text-sm ">
                    <li>
                      <Link
                        href="/staking"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Staking
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/governance"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Governance
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/docs"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Docs
                      </Link>
                    </li>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="hover:text-primary transition flex items-center gap-1 text-muted-foreground ">
                  Trading <ChevronDown className="w-4 h-4" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-3 w-56">
                  <ul className="space-y-2 text-sm ">
                    <li>
                      <Link
                        href="/swap"
                        className="hover:text-primary block px-2 py-1 flex items-center gap-2"
                      >
                        <span>⇅</span> Swap
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/livestreams"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Livestreams
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/leaderboard"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Leaderboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/competitions"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Competitions
                      </Link>
                    </li>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <NavigationMenu.Trigger className=" hover:text-primary transition flex items-center gap-1 text-muted-foreground ">
                  Portfolio <ChevronDown className="w-4 h-4" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-3 w-56">
                  <ul className="space-y-2 text-sm ">
                    <li>
                      <Link
                        href="/positions"
                        className="hover:text-primary block px-2 py-1"
                      >
                        Positions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/history"
                        className="hover:text-primary block px-2 py-1"
                      >
                        History
                      </Link>
                    </li>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport className="absolute top-full left-0 w-full" />
          </NavigationMenu.Root>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={isWalletConnected ? "secondary" : "default"}
          onClick={onConnectWallet}
          data-testid="button-connect-wallet"
          className="py-0 px-2 h-2 min-h-6 bg-[#ff6940]"
        >
          {isWalletConnected ? (
            <span className="font-mono text-sm">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
          ) : (
            <span className="text-[#000000]">Connect</span>
          )}
        </Button>
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          data-testid="button-language"
          className="h-9 w-12"
        >
          <LanguageSwitcher />
        </Button> */}

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          data-testid="button-settings"
          className="h-9 w-9"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

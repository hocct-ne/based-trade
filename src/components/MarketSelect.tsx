"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Market } from "@/store/useMarketState";

interface MarketSelectProps {
  pair: string;
  onPairChange?: (value: string) => void;
  markets: Market[];
}

export function MarketSelect({
  pair,
  onPairChange,
  markets,
}: MarketSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filteredMarkets = markets.filter((m) =>
    m.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className=" text-sm flex items-center gap-1 border rounded-md px-2 py-1"
        >
          {pair}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-[700px] p-0 overflow-hidden"
      >
        {/* Search + Filter */}
        <div className="p-3 border-b flex items-center gap-2">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" variant="outline">
            Strict
          </Button>
          <Button size="sm" variant="secondary">
            All
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="border-b">
          <TabsList className="flex overflow-x-auto">
            {[
              "all",
              "perps",
              "spot",
              "trending",
              "prelaunch",
              "ai",
              "defi",
              "gaming",
              "layer1",
              "layer2",
              "meme",
            ].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Market Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background border-b">
              <tr className="text-muted-foreground text-xs">
                <th className="px-3 py-2 text-left">Symbol</th>
                <th className="px-3 py-2 text-right">Last Price</th>
                <th className="px-3 py-2 text-right">24h Change</th>
                <th className="px-3 py-2 text-right">8hr Funding</th>
                <th className="px-3 py-2 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.map((m) => (
                <tr
                  key={m.symbol}
                  className={`cursor-pointer hover:bg-accent/30 ${
                    pair === m.symbol ? "bg-accent/20" : ""
                  }`}
                  onClick={() => {
                    onPairChange?.(m.symbol);
                    setOpen(false);
                  }}
                >
                  <td className="px-3 py-2 font-medium flex items-center gap-2">
                    {m.symbol}
                  </td>
                  <td className="px-3 py-2 text-right ">{m.markPx}</td>
                  <td
                    className={`px-3 py-2 text-right ${
                      (m.change24h ?? 0) < 0
                        ? "text-[#ff5252]"
                        : "text-[#29ab87]"
                    }`}
                  >
                    {m.change24h?.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2 text-right">
                    {m.funding?.toFixed(4)}%
                  </td>
                  <td className="px-3 py-2 text-right">
                    ${m.volume24h?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
}

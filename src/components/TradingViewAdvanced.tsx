"use client";

import { defaultTradingViewOptions } from "@/config";
import { createHyperliquidDatafeed } from "@/helpers/datafeed";
import { client } from "@/lib/hyperClient";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { widget as TVWidget } from "../../public/charting_library";

interface Props {
  symbol: string;
}

export default function TradingViewAdvanced({ symbol }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeChart = () => {
    try {
      // Simple configuration for testing
      const widgetConfig = {
        ...defaultTradingViewOptions,
        container: "tradingview-chart",
        symbol: symbol,
        theme: "dark",
        // Use a simple datafeed for now
        datafeed: createHyperliquidDatafeed(client),
      };

      const widget = new TVWidget(widgetConfig as any);
      console.log("widget", widget);

      // Check if widget has onChartReady method before calling it
      if (widget && typeof widget.onChartReady === "function") {
        widget.onChartReady(() => {
          setTimeout(() => setIsLoading(false), 1000);

          const chart = widget.activeChart();
          widget.applyOverrides({
            "paneProperties.backgroundType": "solid",
            "paneProperties.background": "#101010",
          });
          widget.setCSSCustomProperty(
            "--tv-color-platform-background",
            "#101010"
          );
          widget.setCSSCustomProperty("--tv-color-pane-background", "#101010");

          widget.setCSSCustomProperty(
            "--tv-color-popup-element-background-active",
            "#ff6940"
          );
          widget.setCSSCustomProperty(
            "--tv-color-toolbar-button-text-active",
            "#ff6940"
          );
          widget.setCSSCustomProperty(
            "--tv-color-toolbar-button-text-active-hover",
            "#ff6940"
          );

          chart.onIntervalChanged().subscribe(null, (interval: string) => {
            chart.resetData();
            // onTimeframeChange(interval);
          });
        });
      }
    } catch (err) {
      console.error("Error initializing TradingView:", err);
    }
  };

  useEffect(() => {
    initializeChart();
  }, [client, symbol]);

  useEffect(() => {
    setIsLoading(true);
  }, [symbol]);

  if (error) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center text-red-500 text-base flex-col gap-2.5">
        <div>{error}</div>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            window.location.reload();
          }}
          className="px-4 py-2 bg-emerald-500 text-white border-none rounded cursor-pointer hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute z-10 w-full h-full bg-td-basicBg flex items-center justify-center">
          <Loader2 className="animate-spin" size={64} />
        </div>
      )}
      <div
        id={`tradingview-chart`}
        className={`absolute w-full h-full ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}

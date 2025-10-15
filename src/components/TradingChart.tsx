"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  CandlestickData,
  HistogramData,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

interface TradingChartProps {
  symbol: string;
}

declare enum SeriesType {
  Area = "Area",
  Bar = "Bar",
  Baseline = "Baseline",
  Candlestick = "Candlestick",
  Histogram = "Histogram",
  Line = "Line",
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d">("1h");

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0B0E11" },
        textColor: "#D1D5DB",
      },
      grid: {
        vertLines: { color: "#1C2128" },
        horzLines: { color: "#1C2128" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#1C2128" },
      timeScale: { borderColor: "#1C2128", timeVisible: true },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    chartRef.current = chart;

    const candleOptions = {
      upColor: "#16a34a",
      borderUpColor: "#16a34a",
      wickUpColor: "#16a34a",
      downColor: "#dc2626",
      borderDownColor: "#dc2626",
      wickDownColor: "#dc2626",
      borderVisible: false,
    };

    const volumeOptions = {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.8, bottom: 0 },
    };

    const candleSeries = chart.addSeries(CandlestickSeries, candleOptions);
    const volumeSeries = chart.addSeries(HistogramSeries, { color: "#26a69a" });

    // Mock data
    const genMock = (): CandlestickData[] => {
      const arr: CandlestickData[] = [];
      let price = 115000;
      const now = Math.floor(Date.now() / 1000);
      for (let i = 100; i >= 0; i--) {
        const t = now - i * 3600;
        const open = price + (Math.random() - 0.5) * 200;
        const close = open + (Math.random() - 0.5) * 250;
        const high = Math.max(open, close) + Math.random() * 60;
        const low = Math.min(open, close) - Math.random() * 60;
        arr.push({ time: t as any, open, high, low, close });
        price = close;
      }
      return arr;
    };

    const candleData = genMock();
    candleSeries.setData(candleData);

    const volumeData: HistogramData[] = candleData.map((d) => ({
      time: d.time,
      value: Math.round(Math.random() * 1000 + 100),
      color: d.close > d.open ? "rgba(22,163,74,0.4)" : "rgba(220,38,38,0.4)",
    }));
    volumeSeries.setData(volumeData);

    // resize
    const onResize = () => {
      if (!chartRef.current || !containerRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [symbol, timeframe]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {(["1h", "4h", "1d"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-2 py-1 text-xs rounded-md ${
              timeframe === t
                ? "bg-accent text-white"
                : "text-gray-400 hover:text-white hover:bg-[#1c1f24]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

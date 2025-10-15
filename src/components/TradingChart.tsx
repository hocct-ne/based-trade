"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  CandlestickData,
  HistogramData,
  ISeriesApi,
} from "lightweight-charts";

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d">("1h");

  useEffect(() => {
    if (!containerRef.current) return;

    // create chart
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

    // OPTIONS
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
      priceScaleId: "", // put on separate scale
      scaleMargins: { top: 0.8, bottom: 0 },
    };

    // Helper: create candlestick series in a compatibility-safe way
    const createCandles = (): ISeriesApi<"Candlestick"> => {
      // @ts-ignore runtime check
      if (typeof (chart as any).addCandlestickSeries === "function") {
        // preferred modern API
        return (chart as any).addCandlestickSeries(candleOptions);
      }
      // fallback: some builds expose addSeries(name, opts)
      if (typeof (chart as any).addSeries === "function") {
        return (chart as any).addSeries("Candlestick", candleOptions);
      }
      throw new Error(
        "No candlestick series API available on lightweight-charts build."
      );
    };

    const createVolume = (): ISeriesApi<"Histogram"> => {
      // @ts-ignore runtime check
      if (typeof (chart as any).addHistogramSeries === "function") {
        return (chart as any).addHistogramSeries(volumeOptions);
      }
      if (typeof (chart as any).addSeries === "function") {
        return (chart as any).addSeries("Histogram", volumeOptions);
      }
      throw new Error(
        "No histogram series API available on lightweight-charts build."
      );
    };

    // create series
    const candleSeries = createCandles();
    const volumeSeries = createVolume();

    // generate mock candlestick data (time in unix seconds)
    const genMock = (): CandlestickData[] => {
      const arr: CandlestickData[] = [];
      let price = 115000;
      const now = Math.floor(Date.now() / 1000);

      for (let i = 100; i >= 0; i--) {
        const t = now - i * 3600; // hourly points
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

    // volume histogram data matched to candles
    const volumeData: HistogramData[] = candleData.map((d) => ({
      time: d.time,
      value: Math.round(Math.random() * 1000 + 100),
      color: d.close > d.open ? "rgba(22,163,74,0.4)" : "rgba(220,38,38,0.4)",
    }));
    volumeSeries.setData(volumeData);

    // Apply volume scale options if supported
    try {
      // some builds allow priceScale().applyOptions on series
      // @ts-ignore
      if (typeof volumeSeries.priceScale === "function") {
        // @ts-ignore
        volumeSeries
          .priceScale()
          .applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      }
    } catch (e) {
      // ignore if not supported in this build
    }

    // resize handler
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
      try {
        chart.remove();
      } catch (e) {
        // ignore remove errors
      }
      chartRef.current = null;
    };
  }, [symbol, timeframe]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {/* {(["1h", "4h", "1d"] as const).map((t) => (
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
        ))} */}
      </div>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

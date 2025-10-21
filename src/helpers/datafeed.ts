import { Hyperliquid } from "@coin98-hyper/core";

let prevParams = {};

interface SymbolInfo {
  name: string;
  ticker: string;
  description: string;
  type: string;
  timezone: string;
  exchange: string;
  has_intraday: boolean;
  has_daily: boolean;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
  data_status: string;
  pricescale: number;
  minmov: number;
  session: string;
}

/**
 * Create a TradingView datafeed that connects to Hyperliquid
 */
export const createHyperliquidDatafeed = (hyperSDK: Hyperliquid) => {
  return {
    onReady: (callback: any) => {
      setTimeout(() => {
        callback({
          overrides: {
            "paneProperties.background": "#101010",
            "paneProperties.backgroundType": "solid",
          },
        });
      }, 0);
    },

    searchSymbols: (
      userInput: string,
      exchange: string,
      symbolType: string,
      onResult: any
    ) => {
      onResult([]);
    },

    resolveSymbol: (symbolName: string, onResolve: any, onError: any) => {
      const symbolInfo: SymbolInfo = {
        name: symbolName,
        ticker: symbolName,
        description: `${symbolName} Hyperliquid`,
        type: "crypto",
        timezone: "Etc/UTC",
        exchange: "Hyperliquid",
        pricescale: 100,
        minmov: 1,
        session: "24x7",
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W"],
        data_status: "streaming",
      };

      setTimeout(() => onResolve(symbolInfo), 0);
    },

    getBars: async (
      symbolInfo: any,
      resolution: string,
      periodParams: any,
      onResult: any,
      onError: any
    ) => {
      const response = await hyperSDK.info.getCandleSnapshot(
        symbolInfo.ticker,
        "1m",
        periodParams.from * 1000,
        periodParams.to * 1000
      );

      onResult(
        response.map((data) => {
          return {
            time: data.t,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.c,
            volume: data.v,
          };
        }),
        { noData: false }
      );
    },

    subscribeBars: (
      symbolInfo: any,
      resolution: string,
      onRealtimeCallback: any,
      subscriberUID: string
    ) => {
      console.log("subscribeBars", subscriberUID);

      hyperSDK.subscriptions.subscribeToCandle(
        symbolInfo.ticker,
        "1m",
        (result) => {
          onRealtimeCallback({
            time: result.t,
            open: result.o,
            high: result.h,
            low: result.l,
            close: result.c,
            volume: result.v,
          });
        }
      );
    },

    unsubscribeBars: (subscriberUID: string) => {
      hyperSDK.subscriptions.unsubscribeFromCandle("BTC", "1m");
      console.log("unsubscribeBars", subscriberUID);
    },
  };
};

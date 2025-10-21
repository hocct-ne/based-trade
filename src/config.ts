export const nextConfig = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextRouteApi: process.env.NEXT_PUBLIC_ROUTE_API,
  nextApiKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  nextWalletAddress: process.env.NEXT_PUBLIC_ADDRESS,
};

// Default TradingView widget configuration
export const defaultTradingViewOptions = {
  width: "100%",
  height: "100%",
  interval: "15",
  locale: "en",
  library_path: "/charting_library/",
  timezone: "Etc/UTC",
  enabled_features: ["header_saveload"],
  disabled_features: [
    "header_symbol_search",
    "header_compare",
    "header_screenshot",
  ],
};

export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "vi";

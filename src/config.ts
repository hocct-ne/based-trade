export const nextConfig = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextRouteApi: process.env.NEXT_PUBLIC_ROUTE_API,
  nextApiKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  nextWalletAddress: process.env.NEXT_PUBLIC_ADDRESS,
};

export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "vi";

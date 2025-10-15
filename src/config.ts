export const nextConfig = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextRouteApi: process.env.NEXT_PUBLIC_ROUTE_API,
};

export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "vi";

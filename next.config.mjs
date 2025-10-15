import createNextIntlPlugin from "next-intl/plugin";

// const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  config: {
    turbopack: true,
  },
};

export default nextConfig;

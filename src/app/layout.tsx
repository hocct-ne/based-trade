import type { Metadata } from "next/types";
import { ReactNode } from "react";

import "@/styles/global.css";
// import { unstable_setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
// import { NextIntlClientProvider } from "next-intl";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/theme/theme-provider";

export const metadata: Metadata = {
  title: "Based Trade",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // unstable_setRequestLocale(locale);
  // const messages = await getMessages();
  console.log("Server locale:", locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {/* <NextIntlClientProvider> */}
        {/* <AppProvider> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* </AppProvider> */}
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}

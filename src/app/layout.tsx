import type { Metadata } from "next/types";

import "@/styles/global.css";
// import { unstable_setRequestLocale } from "next-intl/server";
// import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "C98 Trade",
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
        <Toaster />
        {/* </AppProvider> */}
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}

import { fileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config/config";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fin Control",
  description: "Your number one app for managing your finances.",
};

export async function generateStaticParams() {
  return config.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: string };
}>) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <SpeedInsights />
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

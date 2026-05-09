import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/core/AppProviders";

export const metadata: Metadata = {
  title: "ConfigRuntime Platform",
  description: "Config-driven application runtime — build anything from JSON",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ConfigRuntime" },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
        <script dangerouslySetInnerHTML={{ __html: `
          if('serviceWorker' in navigator){
            window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
          }
        `}} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { VisualThemeProvider } from "@/components/visual-theme-provider";
import Script from "next/script";
import ServiceWorker from "@/components/service-worker";
import { AppShell } from "@/components/app-shell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Reloj de poker",
  description: "Reloj de poker sencillo para jugar en casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <VisualThemeProvider>
            <AppShell>{children}</AppShell>
            <Script
              src="https://umami.franmoreno.com/script.js"
              data-website-id="4ed8c773-c855-479f-ac96-abaa15222e10"
              strategy="beforeInteractive"
            />
            <Toaster />
            <ServiceWorker />
          </VisualThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

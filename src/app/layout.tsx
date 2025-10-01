import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Script from "next/script";
import ServiceWorker from "@/components/service-worker";

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
          <div className="flex flex-col items-start justify-items-start p-4 pb-20 font-[family-name:var(--font-geist-sans)] text-foreground sm:p-6 lg:p-10">
            <div className="mb-4 flex w-full items-center justify-end sm:mb-6">
              <ThemeToggle />
            </div>
            {children}
          </div>
          <Script
            src="https://umami.franmoreno.com/script.js"
            data-website-id="4ed8c773-c855-479f-ac96-abaa15222e10"
            strategy="beforeInteractive"
          />
          <Toaster />
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );
}

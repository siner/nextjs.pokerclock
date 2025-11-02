"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/play");

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-[family-name:var(--font-geist-sans)] text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))_25%] to-transparent"
      />

      {!hideHeader && (
        <header className="bg-surface/80 sticky top-0 z-40 border-b border-border/60 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex flex-col">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span className="text-lg font-semibold uppercase text-muted-foreground">
                    Poker Clock
                  </span>
                  by{" "}
                  <img
                    src="/logo-torneospokerlive.png"
                    alt="Logo TorneosPokerLive"
                    className="h-8 w-auto object-contain"
                  />
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pb-24 pt-10 sm:px-8 lg:px-12",
          hideHeader && "max-w-none px-0 pt-6 sm:px-0 lg:px-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}

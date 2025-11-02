"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface PromoBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: BannerAction;
  secondaryAction?: BannerAction;
  icon?: ReactNode;
  variant?: "emphasis" | "subtle";
  className?: string;
}

export function PromoBanner({
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  icon,
  variant = "emphasis",
  className,
}: PromoBannerProps) {
  const baseClasses = cn(
    "relative overflow-hidden rounded-2xl border shadow-lg",
    variant === "emphasis"
      ? "border-transparent bg-[hsl(var(--banner-background))] text-[hsl(var(--banner-foreground))]"
      : "border-border bg-surface text-foreground"
  );

  return (
    <section className={cn(baseClasses, className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl",
          variant === "emphasis"
            ? "bg-[hsl(var(--banner-accent)) / 0.28]"
            : "bg-[hsl(var(--accent)) / 0.16]"
        )}
      />
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="bg-[hsl(var(--banner-accent)) / 0.18] flex h-10 w-10 items-center justify-center rounded-full text-lg">
                {icon}
              </span>
            )}
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--banner-accent))]">
                {eyebrow}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="text-[hsl(var(--banner-foreground)) / 0.85] max-w-2xl text-sm leading-relaxed sm:text-base">
              {description}
            </p>
          )}
        </div>

        {(action || secondaryAction) && (
          <div className="flex flex-col gap-2 sm:items-end">
            {action && (
              <Button
                asChild
                size="lg"
                className={cn(
                  variant === "emphasis"
                    ? "hover:bg-[hsl(var(--banner-accent)) / 0.92] bg-[hsl(var(--banner-accent))] text-[hsl(var(--banner-foreground))]"
                    : ""
                )}
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            )}
            {secondaryAction && (
              <Button asChild variant="outline" size="lg">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

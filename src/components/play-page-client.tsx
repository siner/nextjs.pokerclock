"use client";

interface PlayPageClientProps {
  children: React.ReactNode;
}

export default function PlayPageClient({ children }: PlayPageClientProps) {
  return (
    <section className="flex flex-1 flex-col gap-6 pb-12">{children}</section>
  );
}

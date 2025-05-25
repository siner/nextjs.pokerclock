export const runtime = "edge";
import PlayGame from "@/components/play-game";
import PlayPageClient from "@/components/play-page-client";

export default function Play(params: {
  searchParams: {
    template: string;
  };
}) {
  const { searchParams } = params;
  const { template } = searchParams;

  return (
    <PlayPageClient>
      <PlayGame template={template} />
    </PlayPageClient>
  );
}

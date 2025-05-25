export const runtime = "edge";
import EditTemplateClient from "@/components/edit-template-client";

export default function EditGame({ params }: { params: { id: string } }) {
  return <EditTemplateClient templateId={params.id} />;
}

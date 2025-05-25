import { Metadata } from "next";
import HistoryPageClient from "@/components/history-page-client";

export const metadata: Metadata = {
  title: "Historial de Torneos | Poker Clock",
  description:
    "Consulta el historial completo de torneos jugados con estadísticas detalladas",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}

import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";

import { PlaceholderPage } from "@/components/legal/placeholder-page";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Saved reports — Lexara Legal AI" },
      { name: "description", content: "Exported legal briefs, judgment predictions and precedent digests." },
      { property: "og:title", content: "Saved reports — Lexara Legal AI" },
      { property: "og:description", content: "Your exported briefs and digests." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Saved Reports"
      description="Exported briefs, predictions and precedent digests."
      icon={Save}
    />
  ),
});
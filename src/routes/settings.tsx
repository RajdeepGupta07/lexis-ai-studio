import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

import { PlaceholderPage } from "@/components/legal/placeholder-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lexara Legal AI" },
      { name: "description", content: "Manage your Lexara workspace, plan, storage and model defaults." },
      { property: "og:title", content: "Settings — Lexara Legal AI" },
      { property: "og:description", content: "Workspace, plan and model preferences." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Settings"
      description="Workspace, billing, storage and default model preferences."
      icon={SettingsIcon}
    />
  ),
});
import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

import { PlaceholderPage } from "@/components/legal/placeholder-page";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Lexara Legal AI" },
      { name: "description", content: "Your Lexara profile, bar details and research activity." },
      { property: "og:title", content: "Profile — Lexara Legal AI" },
      { property: "og:description", content: "Profile and research activity." },
    ],
  }),
  component: () => (
    <PlaceholderPage title="Profile" description="Bar details, team and research activity." icon={User} />
  ),
});
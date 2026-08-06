import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

import { PlaceholderPage } from "@/components/legal/placeholder-page";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — Lexara Legal AI" },
      { name: "description", content: "Precedents and analyses you have bookmarked for later review." },
      { property: "og:title", content: "Bookmarks — Lexara Legal AI" },
      { property: "og:description", content: "Saved precedents and analyses in one place." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Bookmarks"
      description="Precedents and analyses you flagged while researching."
      icon={Bookmark}
    />
  ),
});
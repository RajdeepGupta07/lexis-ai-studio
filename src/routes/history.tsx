import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/legal/app-shell";
import { Badge } from "@/components/ui/badge";
import { HISTORY, TASKS } from "@/lib/legal-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Lexara Legal AI" },
      { name: "description", content: "Your last legal analyses, grouped by task, model and date." },
      { property: "og:title", content: "History — Lexara Legal AI" },
      { property: "og:description", content: "Every analysis you have run in Lexara." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <AppShell breadcrumb={[{ label: "Lexara", to: "/dashboard" }, { label: "History" }]}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="animate-fade-up text-3xl font-extrabold sm:text-4xl">History</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last {HISTORY.length} conversations</p>

        <div className="mt-8 space-y-3">
          {HISTORY.map((h, i) => {
            const task = TASKS.find((t) => t.id === h.task)!;
            return (
              <Link
                key={h.id}
                to="/result"
                style={{ animationDelay: `${i * 45}ms` }}
                className="animate-fade-up grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl hover-lift hover:border-primary/40 sm:p-5"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-lg ${task.gradient}`}
                >
                  {task.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{h.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {task.name} · {h.date}
                  </span>
                </span>
                <Badge variant="secondary" className="shrink-0 rounded-full">
                  {h.model}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
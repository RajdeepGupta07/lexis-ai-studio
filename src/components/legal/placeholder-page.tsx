import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "./app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <AppShell breadcrumb={[{ label: "Lexara", to: "/dashboard" }, { label: title }]}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="animate-fade-up text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-2 animate-fade-up text-sm text-muted-foreground">{description}</p>

        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-fade-up grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-3xl border border-border bg-card/60 p-5"
            >
              <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-3 w-2/3 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-border py-16 text-center">
          <Icon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run an analysis in the workspace and it will show up here.
          </p>
          <Button className="mt-6 rounded-xl border-0 gradient-brand text-white" asChild>
            <Link to="/dashboard">Go to workspace</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Filter,
  GitCompare,
  Gavel,
  Landmark,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/legal/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIOR_CASES } from "@/lib/legal-data";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Prior cases — Lexara Legal AI" },
      {
        name: "description",
        content:
          "Browse semantically matched precedents with similarity scores, matching sections, benches and previews.",
      },
      { property: "og:title", content: "Prior cases — Lexara Legal AI" },
      { property: "og:description", content: "Precedent retrieval ranked by semantic similarity." },
    ],
  }),
  component: CasesPage,
});

const SORTS = [
  { id: "similarity", label: "Similarity" },
  { id: "latest", label: "Latest" },
  { id: "court", label: "Court" },
  { id: "state", label: "State" },
];

function CasesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("similarity");
  const [state, setState] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  const states = useMemo(() => Array.from(new Set(PRIOR_CASES.map((c) => c.state))), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRIOR_CASES.filter(
      (c) =>
        (state === "all" || c.state === state) &&
        (!q ||
          `${c.title} ${c.court} ${c.number} ${c.sections.join(" ")} ${c.judges.join(" ")}`
            .toLowerCase()
            .includes(q)),
    ).sort((a, b) => {
      if (sort === "latest") return b.year - a.year;
      if (sort === "court") return a.court.localeCompare(b.court);
      if (sort === "state") return a.state.localeCompare(b.state);
      return b.similarity - a.similarity;
    });
  }, [query, sort, state]);

  return (
    <AppShell breadcrumb={[{ label: "Lexara", to: "/dashboard" }, { label: "Prior Cases" }]}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="animate-fade-up grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Prior Cases</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {results.length} precedents matched against{" "}
              <span className="text-foreground">Mehta v. State of Maharashtra</span>
            </p>
          </div>
          <Button
            variant="outline"
            className="w-fit rounded-xl"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" /> {showFilters ? "Hide" : "Show"} filters
          </Button>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl border border-border bg-card/70 p-4 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative min-w-0">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search court, case number, section or judge…"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 min-w-[168px] rounded-xl">
              <Filter className="h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {SORTS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  Sort by {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="h-11 min-w-[150px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All states</SelectItem>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showFilters && (
          <div className="mt-3 flex animate-fade-in flex-wrap gap-2">
            {["Supreme Court", "High Court", "Arbitration", "2018–2024", "Division Bench"].map((f) => (
              <button
                key={f}
                onClick={() => setQuery(f.includes("Court") ? f : "")}
                className="rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {results.length === 0 ? (
          <div className="mt-16 animate-fade-up rounded-3xl border border-dashed border-border py-20 text-center">
            <Landmark className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">No precedents matched</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try broadening the query or clearing the state filter.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={() => {
                setQuery("");
                setState("all");
              }}
            >
              Reset search
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {results.map((c, i) => (
              <article
                key={c.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-fade-up group flex flex-col rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-xl transition-all duration-300 hover-lift hover:border-primary/40"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-[11px] font-semibold tracking-[0.1em] text-primary uppercase">
                      <Landmark className="h-3 w-3 shrink-0" /> {c.court}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-[16.5px] leading-snug font-bold">{c.title}</h2>
                    <p className="mt-1 truncate text-[11.5px] text-muted-foreground">{c.number}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-success">{c.similarity}%</p>
                    <p className="text-[10px] tracking-wider text-muted-foreground uppercase">match</p>
                  </div>
                </div>

                <Progress value={c.similarity} className="mt-3 h-1" />

                <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{c.preview}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.sections.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full text-[10.5px] font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5 text-[11.5px] text-muted-foreground">
                  <p className="flex items-start gap-1.5">
                    <Gavel className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="min-w-0">{c.judges.join(", ")}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 shrink-0" /> {c.year} · {c.state}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button
                    size="sm"
                    className="rounded-xl border-0 gradient-brand text-white"
                    onClick={() => toast.success("Opening judgment", { description: c.title })}
                  >
                    Open Judgment
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast("Loading PDF…")}>
                    <FileText className="h-3.5 w-3.5" /> View PDF
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => toast("Added to comparison")}>
                    <GitCompare className="h-3.5 w-3.5" /> Compare
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
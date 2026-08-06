import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  FileDown,
  GitCompare,
  MessageSquare,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/legal/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Analysis result — Lexara Legal AI" },
      {
        name: "description",
        content:
          "Review the AI judgment prediction alongside its reasoning, statutes relied upon and citation trail.",
      },
      { property: "og:title", content: "Analysis result — Lexara Legal AI" },
      { property: "og:description", content: "Output and explanation, side by side, with citations." },
    ],
  }),
  component: ResultPage,
});

const OUTPUT = `## Predicted outcome
**Appeal likely to be allowed in part.** The impugned order dated 14 March 2024 is expected to be set aside on the arbitrability question while the costs direction is likely to survive.

### Issues and findings
1. **Arbitrability of the tenancy dispute** — governed by the *Vidya Drolia* four-fold test; the claim is not manifestly non-arbitrable.
2. **Section 8 reference** — the court's refusal to refer is inconsistent with the pro-referral presumption.
3. **Costs** — discretionary; interference unlikely absent perversity.

### Operative reasoning
> Where the arbitration agreement is valid on its face, the referral court performs a *prima facie* review only and leaves the rest to the tribunal.

\`\`\`text
Confidence  82%
Outcome     Allowed in part
Bench       Division Bench (2 judges)
Horizon     4-7 months to disposal
\`\`\``;

const EXPLANATION = `### Why the model reached this conclusion
The retrieved corpus contains **six** closely aligned precedents, five of which resolved the arbitrability question in favour of referral. Feature attribution weighted the following signals most heavily:

- Presence of an unambiguous arbitration clause (weight **0.31**)
- Absence of a statutory bar under the Rent Act (weight **0.24**)
- Bench composition and historical referral rate (weight **0.18**)
- Pleading language matching accepted referral templates (weight **0.14**)

### Caveats
The model has **not** seen the respondent's rejoinder. If the rejoinder pleads fraud going to the root of the agreement, the arbitrability finding may invert.`;

const CITATIONS = [
  "Vidya Drolia v. Durga Trading (2021) 2 SCC 1",
  "Booz Allen v. SBI Home Finance (2011) 5 SCC 532",
  "Arbitration & Conciliation Act, §8",
  "Hindustan Construction v. UOI (2020) 17 SCC 324",
];

/** Minimal markdown renderer: headings, bold, blockquote, lists, code fences. */
function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let list: string[] = [];
  let code: string[] | null = null;

  const inline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
      if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`")) {
        return (
          <code key={i} className="rounded-md bg-secondary/70 px-1.5 py-0.5 font-mono text-[12px] text-primary">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
      return <span key={i}>{part}</span>;
    });

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l${blocks.length}`} className="my-3 space-y-2 pl-1">
        {list.map((li, i) => (
          <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 text-[14px] leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="min-w-0 text-muted-foreground">{inline(li)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      if (code) {
        blocks.push(
          <pre
            key={`c${idx}`}
            className="my-4 overflow-x-auto rounded-2xl border border-border bg-[oklch(0.13_0.004_285)] p-4 font-mono text-[12.5px] leading-relaxed text-primary/90 scrollbar-slim"
          >
            <code>{code.join("\n")}</code>
          </pre>,
        );
        code = null;
      } else code = [];
      return;
    }
    if (code) {
      code.push(line);
      return;
    }
    if (/^[-*] /.test(line)) {
      list.push(line.slice(2));
      return;
    }
    if (/^\d+\. /.test(line)) {
      list.push(line.replace(/^\d+\. /, ""));
      return;
    }
    flushList();
    if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={idx} className="mt-5 mb-1.5 text-[13px] font-bold tracking-[0.1em] text-primary uppercase">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={idx} className="mt-2 mb-2 text-xl font-bold">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={idx}
          className="my-4 rounded-r-xl border-l-2 border-primary bg-primary/6 py-3 pl-4 text-[14px] leading-relaxed text-muted-foreground italic"
        >
          {inline(line.slice(2))}
        </blockquote>,
      );
    } else if (line) {
      blocks.push(
        <p key={idx} className="my-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
          {inline(line)}
        </p>,
      );
    }
  });
  flushList();
  return <div>{blocks}</div>;
}

function Panel({
  title,
  subtitle,
  children,
  accent,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accent: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="animate-fade-up overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-xl shadow-float">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/40"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
            <span className="truncate text-sm font-semibold">{title}</span>
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{subtitle}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="animate-fade-in border-t border-border px-5 py-4">{children}</div>}
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

function ResultPage() {
  const [streaming, setStreaming] = useState(true);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setChars((c) => {
        const next = c + 26;
        if (next >= OUTPUT.length) {
          clearInterval(timer);
          setStreaming(false);
          return OUTPUT.length;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(OUTPUT);
    toast.success("Output copied to clipboard");
  };

  return (
    <AppShell
      breadcrumb={[
        { label: "Lexara", to: "/dashboard" },
        { label: "Workspace", to: "/dashboard" },
        { label: "Judgment Prediction" },
      ]}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:py-10">
        {/* Header */}
        <div className="animate-fade-up grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gradient-brand border-0 text-white">⚖️ Judgment Prediction</Badge>
              <Badge variant="secondary" className="rounded-full">
                Kimi · 128k ctx
              </Badge>
              {streaming && (
                <Badge variant="outline" className="rounded-full border-primary/50 text-primary">
                  <Sparkle className="mr-1 h-3 w-3" /> Streaming
                </Badge>
              )}
            </div>
            <h1 className="mt-3 truncate text-2xl font-extrabold sm:text-3xl">
              Mehta v. State of Maharashtra
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Civil Appeal No. 4412 of 2024 · 3 documents analysed</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={copy}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Report downloaded")}>
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => toast("Share link created")}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Sparkle} label="Task" value="Judgment Prediction" />
          <Stat icon={ShieldCheck} label="Model" value="Kimi (Moonshot)" />
          <Stat icon={Clock} label="Runtime" value="4.24 s" />
          <div className="rounded-2xl border border-border bg-secondary/40 px-3.5 py-2.5">
            <p className="flex items-center justify-between text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              <span>Confidence</span>
              <span className="font-semibold text-success">82%</span>
            </p>
            <Progress value={82} className="mt-2.5 h-1.5" />
          </div>
        </div>

        {/* Split screen */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel title="Output" subtitle="Model prediction · markdown" accent="oklch(0.62 0.19 256)">
            {chars < 40 ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-11/12 rounded-lg" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : (
              <>
                <Markdown source={OUTPUT.slice(0, chars)} />
                {streaming && (
                  <span className="inline-block h-4 w-[2px] animate-caret bg-primary align-middle" />
                )}
              </>
            )}
          </Panel>

          <Panel title="Explanation" subtitle="Attribution, weights and caveats" accent="oklch(0.63 0.21 293)">
            {streaming ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-10/12 rounded-lg" />
                <Skeleton className="h-4 w-9/12 rounded-lg" />
              </div>
            ) : (
              <div className="animate-fade-in">
                <Markdown source={EXPLANATION} />
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Citations</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {CITATIONS.map((c, i) => (
                      <span
                        key={c}
                        style={{ animationDelay: `${i * 70}ms` }}
                        className="animate-scale-in inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[11.5px] text-primary transition-colors hover:bg-primary/20"
                      >
                        <Check className="h-3 w-3" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="sticky bottom-0 z-30 border-t border-border glass">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-slim sm:px-6">
          <Button variant="outline" className="shrink-0 rounded-xl" asChild>
            <Link to="/cases">
              <GitCompare className="h-4 w-4" /> Compare another model
            </Link>
          </Button>
          <Button
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => {
              setChars(0);
              setStreaming(true);
            }}
          >
            <RefreshCw className="h-4 w-4" /> Run again
          </Button>
          <Button variant="outline" className="shrink-0 rounded-xl" onClick={() => toast.success("Exported as PDF")}>
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" className="shrink-0 rounded-xl" onClick={() => toast.success("Exported as DOCX")}>
            <FileDown className="h-4 w-4" /> Export DOCX
          </Button>
          <Button variant="outline" className="shrink-0 rounded-xl" onClick={() => toast.success("Bookmarked")}>
            <Bookmark className="h-4 w-4" /> Bookmark
          </Button>
          <Button variant="outline" className="shrink-0 rounded-xl" onClick={() => toast("Share link created")}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button className="ml-auto shrink-0 rounded-xl border-0 gradient-brand text-white" onClick={() => toast("Thanks for the feedback")}>
            <MessageSquare className="h-4 w-4" /> Feedback
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
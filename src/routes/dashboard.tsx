import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CloudUpload,
  FileText,
  Gauge,
  Sparkle,
  Trash2,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/legal/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { MODELS, TASKS, type TaskId } from "@/lib/legal-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Workspace — Lexara Legal AI" },
      {
        name: "description",
        content:
          "Upload court documents, choose a legal task and model, and generate grounded AI analysis in the Lexara workspace.",
      },
      { property: "og:title", content: "Workspace — Lexara Legal AI" },
      { property: "og:description", content: "The AI workspace for judgment prediction and precedent research." },
    ],
  }),
  component: Dashboard,
});

type Upload = { id: string; name: string; size: string; progress: number };

const SAMPLE_SIZES = ["1.2 MB", "3.8 MB", "740 KB", "12.4 MB"];

function Dashboard() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [task, setTask] = useState<TaskId>("judgment");
  const [model, setModel] = useState("kimi");
  const [files, setFiles] = useState<Upload[]>([
    { id: "f1", name: "Mehta-v-State-Appeal-Memo.pdf", size: "4.1 MB", progress: 100 },
  ]);
  const [dragging, setDragging] = useState(false);
  const [prompt, setPrompt] = useState("");

  const addFiles = (names: string[]) => {
    const next = names.slice(0, Math.max(0, 10 - files.length)).map((name, i) => ({
      id: `${Date.now()}-${i}`,
      name,
      size: SAMPLE_SIZES[i % SAMPLE_SIZES.length],
      progress: 0,
    }));
    if (!next.length) {
      toast.error("Upload limit reached", { description: "Maximum 10 PDFs / 50 MB per request." });
      return;
    }
    setFiles((f) => [...f, ...next]);
    next.forEach((n) => {
      let p = 0;
      const timer = setInterval(() => {
        p = Math.min(100, p + 18);
        setFiles((f) => f.map((x) => (x.id === n.id ? { ...x, progress: p } : x)));
        if (p >= 100) clearInterval(timer);
      }, 140);
    });
  };

  const activeTask = TASKS.find((t) => t.id === task)!;

  return (
    <AppShell breadcrumb={[{ label: "Lexara", to: "/dashboard" }, { label: "Workspace" }]}>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="animate-fade-up">
          <Badge variant="secondary" className="rounded-full border border-border px-3 py-1 text-[11px]">
            <Sparkle className="mr-1 h-3 w-3 text-primary" /> Grounded on 2.8M Indian judgments
          </Badge>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Good morning, Aditi</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Ask a question or upload a filing — Lexara will cite every source it relies on.
          </p>
        </div>

        {/* Input card */}
        <div className="mt-8 animate-fade-up rounded-3xl border border-border bg-card/70 p-4 backdrop-blur-xl shadow-float sm:p-5">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask any legal question or upload court documents..."
            className="min-h-[120px] resize-none border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const names = Array.from(e.dataTransfer.files).map((f) => f.name);
              addFiles(names.length ? names : ["Dropped-Document.pdf"]);
            }}
            className={`mt-3 rounded-2xl border border-dashed p-6 text-center transition-all duration-300 ${
              dragging
                ? "scale-[1.01] border-primary bg-primary/10"
                : "border-border bg-secondary/25 hover:border-primary/40"
            }`}
          >
            <CloudUpload
              className={`mx-auto h-8 w-8 text-primary transition-transform duration-300 ${dragging ? "-translate-y-1 scale-110" : ""}`}
            />
            <p className="mt-3 text-sm font-medium">Drag &amp; drop court documents here</p>
            <p className="mt-1 text-xs text-muted-foreground">Up to 10 PDFs · 50 MB total</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={(e) => addFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
            />
            <Button
              variant="outline"
              className="mt-4 rounded-xl border-border bg-card/70"
              onClick={() => inputRef.current?.click()}
            >
              <FileText className="h-4 w-4" /> Upload PDF
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="animate-scale-in grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-3 hover-lift"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/12 text-destructive">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium">{f.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {f.progress < 100 ? `Uploading… ${f.progress}%` : f.size}
                    </span>
                    {f.progress < 100 && <Progress value={f.progress} className="mt-1.5 h-1" />}
                  </span>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Remove ${f.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task selector */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Select task
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {TASKS.map((t) => {
              const selected = task === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTask(t.id)}
                  aria-pressed={selected}
                  className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 hover-lift ${
                    selected ? "border-transparent" : "border-border bg-card/60"
                  }`}
                  style={selected ? { boxShadow: `0 0 0 1.5px ${t.ring}, 0 18px 50px -16px ${t.ring}` } : undefined}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${t.gradient} ${
                      selected ? "opacity-[0.16]" : "group-hover:opacity-[0.09]"
                    }`}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-lg ${t.gradient} shadow-float`}
                      >
                        {t.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground">{selected ? "Selected" : "Tap to select"}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{t.blurb}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Model selector */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Select model
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MODELS.map((m) => {
              const selected = model === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  aria-pressed={selected}
                  className={`rounded-3xl border p-4 text-left transition-all duration-300 hover-lift ${
                    selected
                      ? "border-primary/60 bg-primary/8 shadow-glow"
                      : "border-border bg-card/60 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/70 text-sm font-black text-primary">
                      {m.mark}
                    </span>
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      {m.quality}
                    </Badge>
                  </div>
                  <p className="mt-3 font-semibold">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.vendor}</p>
                  <p className="mt-2 min-h-[36px] text-[12px] leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-warning" />
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${i < m.speed ? "bg-warning" : "bg-muted"}`}
                        />
                      ))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-3 w-3" />
                      {m.latency}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="sticky bottom-4 z-30 mt-10">
          <Button
            onClick={() =>
              task === "precedent" ? navigate({ to: "/cases" }) : navigate({ to: "/result" })
            }
            className="group h-14 w-full rounded-2xl border-0 gradient-brand text-base font-semibold text-white shadow-float transition-transform hover:scale-[1.01]"
          >
            Generate {activeTask.name}
            <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {activeTask.emoji} {activeTask.name} · {MODELS.find((m) => m.id === model)?.name} ·{" "}
            {files.length} document{files.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
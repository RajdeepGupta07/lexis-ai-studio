export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] animate-aurora rounded-full bg-[oklch(0.62_0.19_256)]/22 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] animate-aurora rounded-full bg-[oklch(0.63_0.21_293)]/20 blur-[130px] [animation-delay:-6s]" />
      <div className="absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] animate-aurora rounded-full bg-[oklch(0.72_0.17_158)]/12 blur-[140px] [animation-delay:-12s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,var(--background)_75%)]" />
    </div>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand shadow-glow">
        <span className="text-[15px] leading-none font-black text-white">L</span>
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight">Lexara</p>
          <p className="truncate text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Legal Intelligence
          </p>
        </div>
      )}
    </div>
  );
}
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  ChevronsLeft,
  Command as CommandIcon,
  History,
  LayoutDashboard,
  Landmark,
  Menu,
  MessageSquarePlus,
  Moon,
  Save,
  Search,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Logo } from "./aurora";
import { useTheme } from "./use-theme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HISTORY, NOTIFICATIONS, TASKS } from "@/lib/legal-data";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Prior Cases", to: "/cases", icon: Landmark },
  { label: "History", to: "/history", icon: History },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
  { label: "Saved Reports", to: "/reports", icon: Save },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Profile", to: "/profile", icon: User },
] as const;

function taskIcon(id: string) {
  return TASKS.find((t) => t.id === id)?.icon ?? LayoutDashboard;
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="flex items-center justify-between px-1 pt-1">
        <Logo compact={collapsed} />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.to;
          const link = (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/12 text-foreground shadow-glow"
                  : "text-muted-foreground hover:translate-x-0.5 hover:bg-accent/60 hover:text-foreground"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
          return collapsed ? (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      {!collapsed && (
        <>
          <Separator className="opacity-60" />
          <div className="min-h-0 flex-1">
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Recent activity
            </p>
            <ScrollArea className="h-full max-h-[42vh] pr-2">
              <div className="flex flex-col gap-1">
                {HISTORY.map((h, i) => {
                  const Icon = taskIcon(h.task);
                  return (
                    <Link
                      key={h.id}
                      to="/result"
                      onClick={onNavigate}
                      style={{ animationDelay: `${i * 35}ms` }}
                      className="animate-slide-in-left group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border border-transparent px-2.5 py-2 transition-all duration-200 hover:border-border hover:bg-accent/50"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary/70 text-primary transition-transform duration-200 group-hover:scale-110">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium">{h.title}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          {h.date}
                          <span className="opacity-40">•</span>
                          <span className="truncate text-primary/80">{h.model}</span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-auto space-y-3 rounded-2xl border border-border bg-secondary/40 p-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Storage</span>
                <span className="font-medium text-foreground">13.6 / 20 GB</span>
              </div>
              <Progress value={68} className="mt-2 h-1.5" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Badge className="gradient-brand border-0 text-white">Firm Plan</Badge>
              <Link to="/settings" className="text-[11px] text-muted-foreground hover:text-foreground">
                Manage
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl border-border p-0 glass-strong">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Badge variant="secondary" className="rounded-full">
            {NOTIFICATIONS.length} new
          </Badge>
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-slim">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="animate-fade-up rounded-xl p-3 transition-colors hover:bg-accent/60"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.tone === "success"
                      ? "bg-success"
                      : n.tone === "warning"
                        ? "bg-warning"
                        : "bg-primary"
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-border p-0 glass-strong sm:max-w-lg">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="bg-transparent">
          <CommandInput placeholder="Search cases, tasks, models…" />
          <CommandList className="scrollbar-slim">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              {NAV.map((n) => (
                <CommandItem key={n.to} value={n.label} asChild>
                  <Link to={n.to} onClick={() => onOpenChange(false)}>
                    <n.icon className="mr-2 h-4 w-4" />
                    {n.label}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Tasks">
              {TASKS.map((t) => (
                <CommandItem key={t.id} value={t.name} onSelect={() => onOpenChange(false)}>
                  <span className="mr-2">{t.emoji}</span>
                  {t.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Recent">
              {HISTORY.slice(0, 5).map((h) => (
                <CommandItem key={h.id} value={h.title} asChild>
                  <Link to="/result" onClick={() => onOpenChange(false)}>
                    <History className="mr-2 h-4 w-4" />
                    {h.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function AppShell({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: { label: string; to?: string }[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-sidebar transition-[width] duration-300 ease-out lg:block ${
          collapsed ? "w-[76px]" : "w-[280px]"
        }`}
      >
        <SidebarBody collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[290px] animate-slide-in-left border-r border-border bg-sidebar">
            <button
              className="absolute top-4 right-3 rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarBody collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border glass">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden rounded-xl lg:inline-flex"
                onClick={() => setCollapsed((v) => !v)}
                aria-label="Toggle sidebar"
              >
                <ChevronsLeft
                  className={`h-[18px] w-[18px] transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                />
              </Button>
              <nav className="flex min-w-0 items-center gap-2 text-sm">
                {breadcrumb.map((b, i) => (
                  <span key={b.label} className="flex min-w-0 items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground/50">/</span>}
                    {b.to && i < breadcrumb.length - 1 ? (
                      <Link
                        to={b.to}
                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {b.label}
                      </Link>
                    ) : (
                      <span className="truncate font-medium">{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search everything</span>
                <kbd className="ml-4 flex items-center gap-0.5 rounded-md border border-border px-1.5 py-0.5 text-[10px]">
                  <CommandIcon className="h-2.5 w-2.5" />K
                </kbd>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl md:hidden"
                onClick={() => setPaletteOpen(true)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={toggle} aria-label="Toggle theme">
                {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 rounded-full transition-transform hover:scale-105">
                    <Avatar className="h-8 w-8 ring-1 ring-border">
                      <AvatarFallback className="gradient-brand text-[11px] font-semibold text-white">
                        AR
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl glass-strong">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">Adv. Aditi Rao</p>
                    <p className="text-xs font-normal text-muted-foreground">aditi@raochambers.in</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 animate-fade-in">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <button
        onClick={() => toast("Lexara Assistant", { description: "How can I help with this matter?" })}
        className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-white shadow-float transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Open AI assistant"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </button>
    </div>
  );
}
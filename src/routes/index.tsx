import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, Lock, Mail, ShieldCheck, Sparkle } from "lucide-react";
import { useState } from "react";

import heroArt from "@/assets/auth-hero.jpg";
import { Aurora, Logo } from "@/components/legal/aurora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Lexara Legal AI" },
      {
        name: "description",
        content:
          "Sign in to Lexara, the intelligent legal research assistant for judgment prediction, statute extraction and precedent retrieval.",
      },
      { property: "og:title", content: "Sign in — Lexara Legal AI" },
      {
        property: "og:description",
        content: "Analyze legal documents, predict judgments and retrieve precedents with state-of-the-art AI.",
      },
    ],
  }),
  component: LoginPage,
});

const BULLETS = [
  "Analyze legal documents",
  "Predict judgments",
  "Retrieve precedents",
  "Powered by state-of-the-art AI",
];

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2a7 7 0 0 1-6.6-4.8H1.4v3.1A11.9 11.9 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.5a7.1 7.1 0 0 1 0-4.6V6.8H1.4a11.9 11.9 0 0 0 0 10.7l4-3Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.6 11.6 0 0 0 12 0 11.9 11.9 0 0 0 1.4 6.8l4 3.1A7 7 0 0 1 12 4.8Z"
      />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 750);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Aurora />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* Left */}
        <section className="animate-fade-up">
          <Logo />
          <h1 className="mt-10 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.4rem]">
            Your Intelligent
            <br />
            <span className="text-gradient">Legal Research</span> Assistant
          </h1>
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {BULLETS.map((b, i) => (
              <li
                key={b}
                style={{ animationDelay: `${120 + i * 80}ms` }}
                className="animate-fade-up flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="relative mt-9 overflow-hidden rounded-3xl border border-border shadow-float">
            <img
              src={heroArt}
              alt="Neural network merging with the scales of justice inside a courthouse"
              width={1024}
              height={1280}
              className="h-[240px] w-full object-cover object-center sm:h-[320px] lg:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl px-3 py-2 glass">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">
                SOC 2 Type II · Attorney–client privilege preserved
              </span>
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="animate-scale-in mx-auto w-full max-w-md">
          <div className="rounded-3xl p-6 glass-strong shadow-float sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkle className="h-3.5 w-3.5 text-primary" />
              Trusted by 400+ chambers and in-house teams
            </div>

            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary/60">
                <TabsTrigger value="login" className="rounded-lg">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 animate-fade-in">
                <form className="space-y-4" onSubmit={submit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" required placeholder="you@chambers.law" className="h-11 rounded-xl pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="password" type="password" required placeholder="••••••••" className="h-11 rounded-xl pl-9" />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="group h-11 w-full rounded-xl border-0 gradient-brand text-white shadow-glow transition-transform hover:scale-[1.01]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Enter workspace
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 animate-fade-in">
                <form className="space-y-4" onSubmit={submit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required placeholder="Adv. Aditi Rao" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email2">Work email</Label>
                    <Input id="email2" type="email" required placeholder="you@chambers.law" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2">Create password</Label>
                    <Input id="password2" type="password" required placeholder="At least 10 characters" className="h-11 rounded-xl" />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="group h-11 w-full rounded-xl border-0 gradient-brand text-white shadow-glow transition-transform hover:scale-[1.01]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] tracking-wider text-muted-foreground uppercase">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
              className="h-11 w-full rounded-xl border-border bg-secondary/30 hover:bg-accent"
            >
              <GoogleMark />
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
              By continuing you agree to the Lexara Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

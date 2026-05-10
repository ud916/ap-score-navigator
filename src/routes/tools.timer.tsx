import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Volume2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/tools/timer")({
  head: () => ({
    meta: [
      { title: "Practice Exam Timer — ScoreLab" },
      { name: "description", content: "Timed practice exam tool with section timers, alerts, and fullscreen mode." },
      { property: "og:title", content: "Practice Exam Timer" },
      { property: "og:description", content: "Section timers, audio alerts, and fullscreen exam mode." },
    ],
  }),
  component: TimerPage,
});

type Section = { name: string; minutes: number };

const presets: Record<string, Section[]> = {
  "AP Calculus AB": [
    { name: "MCQ Part A (no calc)", minutes: 60 },
    { name: "MCQ Part B (calc)", minutes: 45 },
    { name: "FRQ Part A (calc)", minutes: 30 },
    { name: "FRQ Part B (no calc)", minutes: 60 },
  ],
  "Digital SAT": [
    { name: "Reading & Writing 1", minutes: 32 },
    { name: "Reading & Writing 2", minutes: 32 },
    { name: "Math 1", minutes: 35 },
    { name: "Math 2", minutes: 35 },
  ],
  "ACT": [
    { name: "English", minutes: 45 },
    { name: "Math", minutes: 60 },
    { name: "Reading", minutes: 35 },
    { name: "Science", minutes: 35 },
  ],
};

function beep() {
  if (typeof window === "undefined") return;
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; o.type = "sine";
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start(); o.stop(ctx.currentTime + 0.65);
  } catch {}
}

function TimerPage() {
  const [presetKey, setPresetKey] = useState<keyof typeof presets>("AP Calculus AB");
  const sections = presets[presetKey];
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(sections[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const total = sections[idx].minutes * 60;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIdx(0);
    setRemaining(sections[0].minutes * 60);
    setRunning(false);
  }, [presetKey]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          beep();
          // auto-advance
          setIdx((cur) => {
            const next = cur + 1;
            if (next < sections.length) {
              setRemaining(sections[next].minutes * 60);
              return next;
            }
            setRunning(false);
            return cur;
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, sections]);

  const skip = () => {
    setIdx((cur) => {
      const next = Math.min(cur + 1, sections.length - 1);
      setRemaining(sections[next].minutes * 60);
      return next;
    });
  };

  const reset = () => {
    setIdx(0);
    setRemaining(sections[0].minutes * 60);
    setRunning(false);
  };

  const fullscreen = () => containerRef.current?.requestFullscreen?.();

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const pct = total ? (remaining / total) * 100 : 0;
  const C = 2 * Math.PI * 110;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Practice Exam Timer</h1>
          <p className="mt-2 max-w-2xl text-white/75">Timed sections with audio alerts, auto-advance, and fullscreen mode.</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Exam preset</span>
              <select value={presetKey} onChange={(e) => setPresetKey(e.target.value as keyof typeof presets)} className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm focus:outline-none">
                {Object.keys(presets).map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <button onClick={fullscreen} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Section {idx + 1} of {sections.length}</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{sections[idx].name}</div>

            <div className="relative mt-6 h-64 w-64">
              <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
                <circle cx="120" cy="120" r="110" stroke="oklch(0.93 0.01 260)" strokeWidth="14" fill="none" />
                <motion.circle
                  cx="120" cy="120" r="110"
                  stroke="oklch(0.55 0.22 265)"
                  strokeWidth="14" fill="none" strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C - (pct / 100) * C }}
                  transition={{ duration: 0.4, ease: "linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-6xl font-bold tabular-nums text-foreground">{mins}:{secs}</div>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Volume2 className="h-3 w-3" /> Alert at 0:00
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-glow">
                {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}
              </button>
              <button onClick={skip} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                <SkipForward className="h-4 w-4" /> Next section
              </button>
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {sections.map((s, i) => (
              <div key={i} className={`rounded-2xl border p-3 text-center text-xs ${i === idx ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground"}`}>
                <div className="font-semibold">{s.name}</div>
                <div className="mt-0.5">{s.minutes} min</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

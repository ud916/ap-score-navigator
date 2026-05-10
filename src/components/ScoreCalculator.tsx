import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, RotateCcw, TrendingUp, Award, Target, Sparkles } from "lucide-react";
import type { Subject } from "@/data/subjects";
import { calculate, type CalcResult } from "@/lib/scoring";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { ScoreSlider } from "@/components/ScoreSlider";
import { RadialMeter } from "@/components/RadialMeter";

type Props = { subject: Subject };

const bandStyle: Record<CalcResult["band"], { chip: string; color: string; label: string }> = {
  Excellent: { chip: "bg-accent-green/20 text-accent-green border-accent-green/30", color: "var(--accent-green)", label: "Excellent" },
  Good: { chip: "bg-accent-blue/20 text-accent-blue border-accent-blue/30", color: "var(--accent-blue)", label: "Strong" },
  Borderline: { chip: "bg-accent-orange/20 text-accent-orange border-accent-orange/30", color: "var(--accent-orange)", label: "Average" },
  "At Risk": { chip: "bg-destructive/15 text-destructive border-destructive/30", color: "var(--destructive)", label: "Risk Zone" },
};

export function ScoreCalculator({ subject }: Props) {
  const s = subject.scoring;
  const [state, setState] = useState<any>(() => {
    if (s.kind === "ap") return { mcqCorrect: 0, frqScores: s.frqs.map(() => 0) };
    if (s.kind === "sat") return { rwCorrect: 0, mathCorrect: 0 };
    if (s.kind === "act") return Object.fromEntries(s.sections.map((sec) => [sec.id, 0]));
    return { mcqCorrect: 0, frqScores: s.frqs.map(() => 0) };
  });

  const result = useMemo(() => calculate(subject, state), [subject, state]);
  const band = bandStyle[result.band];

  const reset = () => {
    if (s.kind === "ap") setState({ mcqCorrect: 0, frqScores: s.frqs.map(() => 0) });
    else if (s.kind === "sat") setState({ rwCorrect: 0, mathCorrect: 0 });
    else if (s.kind === "act") setState(Object.fromEntries(s.sections.map((sec) => [sec.id, 0])));
    else setState({ mcqCorrect: 0, frqScores: s.frqs.map(() => 0) });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3 rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-md sm:p-8"
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.32_0.18_270)] text-primary-foreground shadow-soft">
              <CalcIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Interactive Score Builder</h2>
              <p className="text-xs text-muted-foreground">Drag the sliders or tap +/− to update instantly.</p>
            </div>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </header>

        <div className="mt-6 space-y-5">
          {s.kind === "ap" && (
            <>
              <SectionTitle>Multiple Choice</SectionTitle>
              <ScoreSlider
                label="Correct answers"
                max={s.mcq.count}
                value={state.mcqCorrect}
                onChange={(n) => setState((p: any) => ({ ...p, mcqCorrect: n }))}
                accent="primary"
              />
              {s.frqs.length > 0 && (
                <>
                  <SectionTitle>Free Response</SectionTitle>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {s.frqs.map((f, i) => (
                      <ScoreSlider
                        key={f.name}
                        label={f.name}
                        max={f.max}
                        value={state.frqScores[i]}
                        accent="accent-purple"
                        onChange={(n) =>
                          setState((p: any) => {
                            const next = [...p.frqScores];
                            next[i] = n;
                            return { ...p, frqScores: next };
                          })
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {s.kind === "sat" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ScoreSlider label="Reading & Writing correct" max={s.sections[0].count} value={state.rwCorrect} onChange={(n) => setState((p: any) => ({ ...p, rwCorrect: n }))} accent="accent-blue" />
              <ScoreSlider label="Math correct" max={s.sections[1].count} value={state.mathCorrect} onChange={(n) => setState((p: any) => ({ ...p, mathCorrect: n }))} accent="accent-teal" />
            </div>
          )}

          {s.kind === "act" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {s.sections.map((sec) => (
                <ScoreSlider
                  key={sec.id}
                  label={`${sec.name} correct`}
                  max={sec.count}
                  value={state[sec.id] ?? 0}
                  onChange={(n) => setState((p: any) => ({ ...p, [sec.id]: n }))}
                  accent="accent-pink"
                />
              ))}
            </div>
          )}

          {s.kind === "regents" && (
            <>
              <SectionTitle>Multiple Choice</SectionTitle>
              <ScoreSlider label="Correct answers" max={s.mcq.count} value={state.mcqCorrect} onChange={(n) => setState((p: any) => ({ ...p, mcqCorrect: n }))} accent="primary" />
              <SectionTitle>Free Response</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {s.frqs.map((f, i) => (
                  <ScoreSlider
                    key={f.name}
                    label={f.name}
                    max={f.max}
                    value={state.frqScores[i]}
                    accent="accent-orange"
                    onChange={(n) =>
                      setState((p: any) => {
                        const next = [...p.frqScores];
                        next[i] = n;
                        return { ...p, frqScores: next };
                      })
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* Result */}
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="lg:col-span-2 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[oklch(0.22_0.12_270)] via-primary to-[oklch(0.32_0.18_270)] p-6 text-primary-foreground shadow-card sm:p-7">
          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
                style={{ left: `${15 + i * 13}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -12, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <Sparkles className="h-3.5 w-3.5" /> Live prediction
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={result.band}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${band.chip}`}
              >
                {band.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="relative mt-4 flex items-center justify-center">
            <RadialMeter percent={result.percent} primary={result.primary} label={subject.exam} colorVar={band.color} size={220} />
          </div>

          <p className="relative mt-4 text-center text-sm text-white/80">{result.secondary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" /> Percentile</div>
            <div className="mt-1 text-2xl font-bold text-foreground"><AnimatedNumber value={result.percentile} /></div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="h-3.5 w-3.5" /> Readiness</div>
            <div className="mt-1 text-sm font-semibold text-foreground">{result.readiness}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Award className="h-4 w-4 text-primary" /> Section breakdown</div>
          <ul className="mt-3 space-y-2.5">
            {result.breakdown.map((b) => {
              const pct = b.max ? (b.value / b.max) * 100 : 0;
              return (
                <li key={b.label}>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{b.label}</span>
                    <span className="font-medium text-foreground">{b.value.toFixed(1)} / {b.max}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 180, damping: 24 }}
                      className="h-full rounded-full"
                      style={{ background: band.color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.aside>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>;
}

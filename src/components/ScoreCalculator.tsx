import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, RotateCcw, TrendingUp, Award, Target } from "lucide-react";
import type { Subject } from "@/data/subjects";
import { calculate, type CalcResult } from "@/lib/scoring";
import { AnimatedNumber } from "@/components/AnimatedNumber";

type Props = { subject: Subject };

const bandColor: Record<CalcResult["band"], string> = {
  Excellent: "bg-accent-green/15 text-accent-green",
  Good: "bg-accent-blue/15 text-accent-blue",
  Borderline: "bg-accent-orange/15 text-accent-orange",
  "At Risk": "bg-destructive/10 text-destructive",
};

function NumberInput({ value, onChange, max, label }: { value: number; onChange: (n: number) => void; max: number; label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label} <span className="text-muted-foreground/60">/ {max}</span></span>
      <input
        type="number"
        min={0}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0);
        }}
        className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-soft transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}

export function ScoreCalculator({ subject }: Props) {
  const s = subject.scoring;
  const [state, setState] = useState<any>(() => {
    if (s.kind === "ap") return { mcqCorrect: 0, frqScores: s.frqs.map(() => 0) };
    if (s.kind === "sat") return { rwCorrect: 0, mathCorrect: 0 };
    if (s.kind === "act") return Object.fromEntries(s.sections.map((sec) => [sec.id, 0]));
    return { mcqCorrect: 0, frqScores: s.frqs.map(() => 0) };
  });

  const result = useMemo(() => calculate(subject, state), [subject, state]);

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
        className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalcIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Score Calculator</h2>
              <p className="text-xs text-muted-foreground">Enter your raw section scores below.</p>
            </div>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </header>

        <div className="mt-6 space-y-6">
          {s.kind === "ap" && (
            <>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Multiple Choice</h3>
                <NumberInput
                  label="Correct answers"
                  max={s.mcq.count}
                  value={state.mcqCorrect}
                  onChange={(n) => setState((p: any) => ({ ...p, mcqCorrect: n }))}
                />
              </div>
              {s.frqs.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Free Response</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {s.frqs.map((f, i) => (
                      <NumberInput
                        key={f.name}
                        label={f.name}
                        max={f.max}
                        value={state.frqScores[i]}
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
                </div>
              )}
            </>
          )}

          {s.kind === "sat" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumberInput label="Reading & Writing correct" max={s.sections[0].count} value={state.rwCorrect} onChange={(n) => setState((p: any) => ({ ...p, rwCorrect: n }))} />
              <NumberInput label="Math correct" max={s.sections[1].count} value={state.mathCorrect} onChange={(n) => setState((p: any) => ({ ...p, mathCorrect: n }))} />
            </div>
          )}

          {s.kind === "act" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {s.sections.map((sec) => (
                <NumberInput
                  key={sec.id}
                  label={`${sec.name} correct`}
                  max={sec.count}
                  value={state[sec.id] ?? 0}
                  onChange={(n) => setState((p: any) => ({ ...p, [sec.id]: n }))}
                />
              ))}
            </div>
          )}

          {s.kind === "regents" && (
            <>
              <NumberInput label="Multiple choice correct" max={s.mcq.count} value={state.mcqCorrect} onChange={(n) => setState((p: any) => ({ ...p, mcqCorrect: n }))} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {s.frqs.map((f, i) => (
                  <NumberInput
                    key={f.name}
                    label={f.name}
                    max={f.max}
                    value={state.frqScores[i]}
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
        className="lg:col-span-2 flex flex-col gap-4"
      >
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.18_270)] p-6 text-primary-foreground shadow-card sm:p-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/70">Your estimated score</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${bandColor[result.band]}`}>{result.band}</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight sm:text-6xl">{result.primary}</span>
          </div>
          <p className="mt-1 text-sm text-white/80">{result.secondary}</p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Performance</span>
              <span><AnimatedNumber value={result.percent} decimals={0} suffix="%" /></span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.percent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
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
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-primary"
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

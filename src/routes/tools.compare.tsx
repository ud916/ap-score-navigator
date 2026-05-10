import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { subjects, type Subject } from "@/data/subjects";
import { calculate } from "@/lib/scoring";

export const Route = createFileRoute("/tools/compare")({
  head: () => ({
    meta: [
      { title: "Compare AP / SAT / ACT Scores — ScoreLab" },
      { name: "description", content: "Compare projected exam scores side by side, see GPA impact and best subject." },
      { property: "og:title", content: "Compare Scores — ScoreLab" },
      { property: "og:description", content: "Side-by-side score comparison for AP, SAT and ACT." },
    ],
  }),
  component: ComparePage,
});

const apOnly = subjects.filter((s) => s.scoring.kind === "ap");

type Row = { id: string; subject: Subject; mcqPct: number; frqPct: number };

const newRow = (subject: Subject): Row => ({ id: `${subject.slug}-${Date.now()}-${Math.random()}`, subject, mcqPct: 75, frqPct: 70 });

function ComparePage() {
  const [rows, setRows] = useState<Row[]>(() => [newRow(apOnly[0]), newRow(apOnly[1])]);
  const [picker, setPicker] = useState(false);

  const computed = useMemo(() => rows.map((r) => {
    const s = r.subject.scoring;
    if (s.kind !== "ap") return null;
    const mcqCorrect = Math.round((r.mcqPct / 100) * s.mcq.count);
    const frqScores = s.frqs.map((f) => (r.frqPct / 100) * f.max);
    const result = calculate(r.subject, { mcqCorrect, frqScores });
    return { row: r, result };
  }).filter(Boolean) as { row: Row; result: ReturnType<typeof calculate> }[], [rows]);

  const best = computed.reduce<{ row: Row; result: ReturnType<typeof calculate> } | null>((b, c) => (!b || c.result.percent > b.result.percent ? c : b), null);

  const gpaBoost = computed.reduce((sum, c) => sum + (c.result.apScore && c.result.apScore >= 3 ? 1 : 0), 0) * 0.5;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compare Scores</h1>
          <p className="mt-2 max-w-2xl text-white/75">Add multiple AP exams, set projected performance, and benchmark side-by-side.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Stat label="Exams compared" value={`${computed.length}`} />
            {best && <Stat label="Best subject" value={best.row.subject.title} />}
            <Stat label="Est. GPA boost" value={`+${gpaBoost.toFixed(1)}`} />
          </div>
          <button onClick={() => setPicker((v) => !v)} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-glow">
            <Plus className="h-4 w-4" /> Add subject
          </button>
        </div>

        {picker && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {apOnly.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => { setRows((r) => [...r, newRow(s)]); setPicker(false); }}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-left text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {computed.map(({ row, result }, i) => (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Difficulty {row.subject.difficulty}/5</div>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{row.subject.title}</h3>
                </div>
                <button onClick={() => setRows((rs) => rs.filter((x) => x.id !== row.id))} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <Slider label="MCQ %" value={row.mcqPct} onChange={(v) => setRows((rs) => rs.map((x) => x.id === row.id ? { ...x, mcqPct: v } : x))} />
                <Slider label="FRQ %" value={row.frqPct} onChange={(v) => setRows((rs) => rs.map((x) => x.id === row.id ? { ...x, frqPct: v } : x))} />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-primary/5 p-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated AP</div>
                  <div className="text-3xl font-bold text-primary">{result.primary}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{result.band}</div>
                  <div className="mt-1 font-medium text-foreground">{result.percent.toFixed(0)}%</div>
                </div>
              </div>

              {best?.row.id === row.id && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green">
                  <Award className="h-3.5 w-3.5" /> Best score
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-2 shadow-soft">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span><span className="font-semibold text-foreground">{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="mt-1 w-full accent-[oklch(var(--primary))]" />
    </label>
  );
}

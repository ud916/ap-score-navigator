import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { colleges, creditsAwarded, tuitionPerCredit } from "@/data/colleges";
import { subjects } from "@/data/subjects";

export const Route = createFileRoute("/tools/planner")({
  head: () => ({
    meta: [
      { title: "AP Credit Planner — ScoreLab" },
      { name: "description", content: "Plan your AP courses and predict college credits, tuition savings, and graduation acceleration." },
      { property: "og:title", content: "AP Credit Planner" },
      { property: "og:description", content: "Predict college credits and tuition savings from your AP plan." },
    ],
  }),
  component: PlannerPage,
});

const apOnly = subjects.filter((s) => s.scoring.kind === "ap");

type PlanItem = { slug: string; score: number };

function PlannerPage() {
  const [collegeId, setCollegeId] = useState(colleges[0].id);
  const [plan, setPlan] = useState<PlanItem[]>([{ slug: apOnly[0].slug, score: 4 }]);
  const college = colleges.find((c) => c.id === collegeId)!;

  const totals = useMemo(() => {
    let credits = 0;
    let savings = 0;
    plan.forEach((p) => {
      const c = creditsAwarded(college, p.slug, p.score);
      credits += c;
      savings += c * tuitionPerCredit(college);
    });
    const semestersSaved = credits / 15;
    return { credits, savings, semestersSaved };
  }, [plan, college]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AP Credit Planner</h1>
          <p className="mt-2 max-w-2xl text-white/75">Plan your APs and forecast credits, savings, and time to graduation.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Target university</span>
                <select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none">
                  {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">My AP plan</h2>
                <button
                  onClick={() => setPlan((p) => [...p, { slug: apOnly[0].slug, score: 4 }])}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary-glow"
                >
                  <Plus className="h-3.5 w-3.5" /> Add AP
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.map((p, i) => (
                  <motion.li key={i} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3">
                    <select value={p.slug} onChange={(e) => setPlan((arr) => arr.map((x, idx) => idx === i ? { ...x, slug: e.target.value } : x))} className="flex-1 rounded-lg border border-border bg-card px-2 py-1.5 text-sm focus:outline-none">
                      {apOnly.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                    </select>
                    <select value={p.score} onChange={(e) => setPlan((arr) => arr.map((x, idx) => idx === i ? { ...x, score: parseInt(e.target.value) } : x))} className="w-20 rounded-lg border border-border bg-card px-2 py-1.5 text-sm focus:outline-none">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>Score {n}</option>)}
                    </select>
                    <button onClick={() => setPlan((arr) => arr.filter((_, idx) => idx !== i))} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.18_270)] p-5 text-primary-foreground shadow-card">
              <div className="text-xs uppercase tracking-wider text-white/70">Estimated tuition savings</div>
              <div className="mt-2 text-4xl font-bold">${Math.round(totals.savings).toLocaleString()}</div>
              <div className="mt-1 text-xs text-white/75">at {college.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="text-xs text-muted-foreground">Credits</div>
                <div className="text-2xl font-bold text-foreground">{totals.credits.toFixed(0)}</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="text-xs text-muted-foreground">Semesters saved</div>
                <div className="text-2xl font-bold text-foreground">{totals.semestersSaved.toFixed(1)}</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, DollarSign } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { colleges, creditsAwarded, tuitionPerCredit } from "@/data/colleges";
import { subjects } from "@/data/subjects";

export const Route = createFileRoute("/tools/college-credit")({
  head: () => ({
    meta: [
      { title: "College AP Credit Lookup — ScoreLab" },
      { name: "description", content: "Search universities for AP credit policies, minimum scores, and tuition savings." },
      { property: "og:title", content: "College Credit Lookup" },
      { property: "og:description", content: "AP credit policies for top universities." },
    ],
  }),
  component: CreditLookup,
});

const apOnly = subjects.filter((s) => s.scoring.kind === "ap");

function CreditLookup() {
  const [query, setQuery] = useState("");
  const [subjectSlug, setSubjectSlug] = useState(apOnly[0].slug);
  const [score, setScore] = useState(4);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return colleges.filter((c) => !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">College AP Credit Lookup</h1>
          <p className="mt-2 max-w-2xl text-white/75">See which universities accept your AP score for credit, plus estimated tuition savings.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft sm:grid-cols-3">
          <label className="sm:col-span-1">
            <span className="text-xs font-medium text-muted-foreground">Search university</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Harvard, UCLA…" className="h-10 w-full bg-transparent text-sm focus:outline-none" />
            </div>
          </label>
          <label>
            <span className="text-xs font-medium text-muted-foreground">AP subject</span>
            <select value={subjectSlug} onChange={(e) => setSubjectSlug(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none">
              {apOnly.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
            </select>
          </label>
          <label>
            <span className="text-xs font-medium text-muted-foreground">Your score</span>
            <select value={score} onChange={(e) => setScore(parseInt(e.target.value))} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => {
            const credits = creditsAwarded(c, subjectSlug, score);
            const min = c.policy[subjectSlug] ?? c.defaultMin;
            const savings = credits * tuitionPerCredit(c);
            const accepted = credits > 0;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-3xl border ${accepted ? "border-accent-green/40" : "border-border"} bg-card p-5 shadow-soft`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" /> {c.name}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.location}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${accepted ? "bg-accent-green/15 text-accent-green" : "bg-muted text-muted-foreground"}`}>
                    {accepted ? "Credit awarded" : "Not eligible"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-muted-foreground">Min score</div>
                    <div className="text-base font-bold text-foreground">{min}</div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-muted-foreground">Credits</div>
                    <div className="text-base font-bold text-foreground">{credits || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-muted-foreground">Savings</div>
                    <div className="inline-flex items-center justify-center gap-0.5 text-base font-bold text-foreground">
                      <DollarSign className="h-3.5 w-3.5" />{Math.round(savings).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

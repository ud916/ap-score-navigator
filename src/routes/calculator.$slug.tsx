import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ListChecks, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ScoreCalculator } from "@/components/ScoreCalculator";
import { getSubjectBySlug } from "@/data/subjects";

export const Route = createFileRoute("/calculator/$slug")({
  loader: ({ params }) => {
    const subject = getSubjectBySlug(params.slug);
    if (!subject) throw notFound();
    return { subject };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.subject.title} Score Calculator — ScoreLab` },
          { name: "description", content: `Estimate your ${loaderData.subject.title} score. ${loaderData.subject.description}` },
          { property: "og:title", content: `${loaderData.subject.title} Score Calculator` },
          { property: "og:description", content: loaderData.subject.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Subject not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
      </div>
    </div>
  ),
  component: CalculatorPage,
});

function CalculatorPage() {
  const { subject } = Route.useLoaderData();
  const s = subject.scoring;
  const totalQuestions =
    s.kind === "ap" ? s.mcq.count + s.frqs.length
    : s.kind === "sat" ? s.sections.reduce((n, x) => n + x.count, 0)
    : s.kind === "act" ? s.sections.reduce((n, x) => n + x.count, 0)
    : s.mcq.count + s.frqs.length;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All calculators
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            {subject.title} Score Calculator
          </motion.h1>
          <p className="mt-3 max-w-2xl text-base text-white/75">{subject.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Stat icon={<Clock className="h-3.5 w-3.5" />} label={subject.duration} />
            <Stat icon={<ListChecks className="h-3.5 w-3.5" />} label={`${totalQuestions} items`} />
            <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label={`Difficulty ${subject.difficulty}/5`} />
            {subject.passRate != null && (
              <Stat icon={<BookOpen className="h-3.5 w-3.5" />} label={`${Math.round(subject.passRate * 100)}% pass rate`} />
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScoreCalculator subject={subject} />

        {/* Distribution + tips */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {subject.distribution && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground">Recent score distribution</h2>
              <p className="mt-1 text-xs text-muted-foreground">% of test-takers receiving each score (estimated)</p>
              <ul className="mt-5 space-y-3">
                {subject.distribution.map((d) => (
                  <li key={d.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{d.label}</span>
                      <span className="text-muted-foreground">{d.pct}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, d.pct * 2)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">Study tips</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {subject.studyTips.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border">
            {subject.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                  {f.q}
                  <span className="text-muted-foreground transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
      {icon} {label}
    </span>
  );
}

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { SubjectCard } from "@/components/SubjectCard";
import { categories, subjects } from "@/data/subjects";

export function HomePage() {
  const [query, setQuery] = useState("");

  const filteredByCategory = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? subjects.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q),
        )
      : subjects;
    return categories
      .map((cat) => ({ category: cat, items: filtered.filter((s) => s.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const totalResults = filteredByCategory.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Hero query={query} setQuery={setQuery} />
        <FeatureCards />

        <section id="calculators" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Browse AP score calculators
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Pick a subject to start estimating. Each calculator uses the latest official scoring guidelines.
            </p>
          </motion.div>

          {totalResults === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <SearchX className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">No subjects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We couldn't match "{query}". Try a different keyword or browse all subjects.
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <div className="space-y-16">
              <AnimatePresence mode="popLayout">
                {filteredByCategory.map((group) => (
                  <motion.div
                    key={group.category}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                        {group.category}
                      </h3>
                      <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {group.items.length} {group.items.length === 1 ? "exam" : "exams"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.items.map((s, i) => (
                        <SubjectCard key={s.slug} subject={s} index={i} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ScoreLab. Estimates only — not affiliated with the College Board.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition hover:text-foreground">Privacy</a>
            <a href="#" className="transition hover:text-foreground">Terms</a>
            <a href="#" className="transition hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

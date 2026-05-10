import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Atom,
  BookOpen,
  Calculator,
  ChevronRight,
  Code2,
  GraduationCap,
  Globe2,
  Landmark,
  Search,
  X,
} from "lucide-react";
import { categories, subjects, type Subject } from "@/data/subjects";

const meta: Record<
  (typeof categories)[number],
  { icon: typeof Atom; color: string; bg: string }
> = {
  "SAT, ACT & Test Prep": { icon: GraduationCap, color: "#2563eb", bg: "#eff6ff" },
  Sciences: { icon: Atom, color: "#16a34a", bg: "#f0fdf4" },
  Math: { icon: Calculator, color: "#7c3aed", bg: "#f5f3ff" },
  "Social Studies": { icon: Landmark, color: "#ea580c", bg: "#fff7ed" },
  "English Language Arts": { icon: BookOpen, color: "#db2777", bg: "#fdf2f8" },
  "Computer Science": { icon: Code2, color: "#0d9488", bg: "#f0fdfa" },
  "World Languages": { icon: Globe2, color: "#9333ea", bg: "#faf5ff" },
};

export function CategoryDirectory() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? subjects.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q),
        )
      : subjects;
    return categories
      .map((cat) => ({
        category: cat,
        items: filtered.filter((s) => s.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Compact navbar */}
      <header className="sticky top-0 z-50 bg-[#0f172a] text-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold tracking-tight">ScoreLab</span>
          </Link>

          <div className="hidden items-center gap-5 text-sm font-medium text-white/70 md:flex">
            <Link to="/tools/compare" className="hover:text-white transition">Compare</Link>
            <Link to="/tools/college-credit" className="hover:text-white transition">Credit</Link>
            <Link to="/tools/planner" className="hover:text-white transition">Planner</Link>
            <Link to="/tools/timer" className="hover:text-white transition">Timer</Link>
          </div>

          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 bg-[#0f172a] px-4 pb-3 pt-2 sm:px-6 lg:px-8"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Search className="h-4 w-4 text-white/60" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exams…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Page heading - minimal */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Exam calculators
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Pick a subject to estimate your score.
        </p>
      </div>

      {/* Category grid */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">No subjects match "{query}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {grouped.map((g, i) => (
              <CategoryCard key={g.category} category={g.category} items={g.items} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} ScoreLab — Estimates only.
      </footer>
    </div>
  );
}

function CategoryCard({
  category,
  items,
  index,
}: {
  category: (typeof categories)[number];
  items: Subject[];
  index: number;
}) {
  const m = meta[category];
  const Icon = m.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.04)] ring-1 ring-slate-100"
    >
      <div className="h-1 w-full" style={{ backgroundColor: m.color }} />
      <div className="p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: m.bg, color: m.color }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-900 sm:text-sm">
            {category}
          </h2>
        </div>

        <ul className="space-y-0.5">
          {items.map((s) => (
            <li key={s.slug}>
              <Link
                to="/calculator/$slug"
                params={{ slug: s.slug }}
                className="group/item flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 sm:text-sm"
                activeProps={{
                  className:
                    "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px] sm:text-sm bg-slate-100 font-medium text-slate-900",
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Calculator
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: m.color }}
                  />
                  <span className="truncate">{s.title}</span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover/item:text-slate-500" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

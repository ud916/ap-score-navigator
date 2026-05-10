import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { subjects } from "@/data/subjects";

type Props = {
  query: string;
  setQuery: (v: string) => void;
};

export function Hero({ query, setQuery }: Props) {
  return (
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary-glow opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-accent-purple opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:pb-28 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 glass-dark px-4 py-1.5 text-xs font-medium text-white/90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {subjects.length} AP subjects supported
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          AP Score Calculator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-center text-base text-white/75 sm:text-lg"
        >
          Instantly estimate your AP exam score. Enter your MCQ and FRQ answers and see where you land on the 1–5 scale.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          onSubmit={(e) => e.preventDefault()}
          className="relative mx-auto mt-10 max-w-2xl"
        >
          <div className="group relative">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl transition group-focus-within:bg-primary-glow/40" />
            <div className="relative flex items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-glow ring-1 ring-white/30 transition focus-within:ring-2 focus-within:ring-primary-glow sm:py-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AP Calculus, Biology, U.S. History…"
                aria-label="Search AP subjects"
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <a
                href="#calculators"
                className="hidden shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow sm:inline-flex"
              >
                Browse
              </a>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-white/55">
            Trusted by thousands of students preparing for the May exams.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

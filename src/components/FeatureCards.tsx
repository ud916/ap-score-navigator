import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GraduationCap, ListChecks, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
};

const features: Feature[] = [
  {
    title: "Compare Scores",
    description: "Benchmark your projected score against historical curves.",
    icon: BarChart3,
    accent: "hover:border-accent-purple/50",
    iconBg: "bg-accent-purple/10 text-accent-purple",
  },
  {
    title: "College Credit Lookup",
    description: "See which colleges accept your AP score for credit.",
    icon: GraduationCap,
    accent: "hover:border-accent-blue/50",
    iconBg: "bg-accent-blue/10 text-accent-blue",
  },
  {
    title: "AP Credit Planner",
    description: "Plan your course load and maximize college credits.",
    icon: ListChecks,
    accent: "hover:border-accent-green/50",
    iconBg: "bg-accent-green/10 text-accent-green",
  },
  {
    title: "Practice Exam Timer",
    description: "Simulate timed AP sections with realistic pacing.",
    icon: Timer,
    accent: "hover:border-accent-orange/50",
    iconBg: "bg-accent-orange/10 text-accent-orange",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="relative -mt-12 sm:-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.a
              href="#calculators"
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className={`group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card ${f.accent}`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.iconBg}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
                Open
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, Clock, FileText } from "lucide-react";
import type { Subject } from "@/data/subjects";

const accentMap: Record<Subject["accent"], { border: string; dot: string; ring: string; text: string }> = {
  purple: { border: "hover:border-accent-purple/60", dot: "bg-accent-purple", ring: "ring-accent-purple/15", text: "text-accent-purple" },
  blue:   { border: "hover:border-accent-blue/60",   dot: "bg-accent-blue",   ring: "ring-accent-blue/15",   text: "text-accent-blue" },
  green:  { border: "hover:border-accent-green/60",  dot: "bg-accent-green",  ring: "ring-accent-green/15",  text: "text-accent-green" },
  orange: { border: "hover:border-accent-orange/60", dot: "bg-accent-orange", ring: "ring-accent-orange/15", text: "text-accent-orange" },
  pink:   { border: "hover:border-accent-pink/60",   dot: "bg-accent-pink",   ring: "ring-accent-pink/15",   text: "text-accent-pink" },
  teal:   { border: "hover:border-accent-teal/60",   dot: "bg-accent-teal",   ring: "ring-accent-teal/15",   text: "text-accent-teal" },
};

export function SubjectCard({ subject, index }: { subject: Subject; index: number }) {
  const a = accentMap[subject.accent];
  return (
    <motion.a
      href="#"
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3 }}
      className={`group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card ${a.border}`}
    >
      <div className="flex items-center gap-2">
        <span className={`inline-flex h-1.5 w-1.5 rounded-full ${a.dot}`} />
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${a.text}`}>
          AP Calculator
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold leading-tight text-foreground">{subject.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{subject.description}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {subject.questions} questions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {subject.duration}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-foreground">Calculate my score</span>
        <ArrowRight className={`h-4 w-4 ${a.text} transition-transform group-hover:translate-x-1`} />
      </div>
    </motion.a>
  );
}

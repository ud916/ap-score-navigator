import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/60 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">ScoreLab</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#calculators" className="transition hover:text-foreground">Calculators</a>
          <a href="#features" className="transition hover:text-foreground">Tools</a>
          <a href="#" className="transition hover:text-foreground">Resources</a>
          <a href="#" className="transition hover:text-foreground">About</a>
        </nav>
        <a
          href="#calculators"
          className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-soft transition hover:opacity-90"
        >
          Get started
        </a>
      </div>
    </motion.header>
  );
}

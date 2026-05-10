import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

type Props = {
  label: string;
  value: number;
  max: number;
  onChange: (n: number) => void;
  /** CSS color (e.g. "var(--accent-purple)") */
  color?: string;
};

export function ScoreSlider({ label, value, max, onChange, color = "var(--primary)" }: Props) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const holdRef = useRef<number | null>(null);
  const latestRef = useRef(value);
  useEffect(() => { latestRef.current = value; }, [value]);

  const startHold = (delta: number) => {
    onChange(clamp(value + delta, 0, max));
    let t = 380;
    const step = () => {
      onChange(clamp(latestRef.current + delta, 0, max));
      t = Math.max(35, t - 60);
      holdRef.current = window.setTimeout(step, t);
    };
    holdRef.current = window.setTimeout(step, t);
  };
  const stopHold = () => { if (holdRef.current) { clearTimeout(holdRef.current); holdRef.current = null; } };

  return (
    <div
      className="group relative rounded-2xl border border-border/70 bg-card/70 p-4 shadow-soft backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-card sm:p-5"
      style={{ ['--slider-color' as any]: color }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold tabular-nums text-foreground">
          <AnimatedNumber value={value} /> <span className="text-muted-foreground">/ {max}</span>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onPointerDown={() => startHold(-1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          disabled={value <= 0}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-40"
          style={{ color: value > 0 ? color : undefined, borderColor: value > 0 ? `color-mix(in oklab, ${color} 40%, transparent)` : undefined }}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="relative flex-1">
          <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 65%, white))` }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="score-slider absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
            aria-label={label}
          />
        </div>

        <button
          type="button"
          aria-label={`Increase ${label}`}
          onPointerDown={() => startHold(1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          disabled={value >= max}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-40"
          style={{ color: value < max ? color : undefined, borderColor: value < max ? `color-mix(in oklab, ${color} 40%, transparent)` : undefined }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

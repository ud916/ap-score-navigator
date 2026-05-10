import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";

type Props = {
  percent: number; // 0-100
  primary: string;
  label: string;
  colorVar: string; // e.g. "var(--accent-green)"
  size?: number;
};

export function RadialMeter({ percent, primary, label, colorVar, size = 200 }: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, percent)) / 100) * c;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: `radial-gradient(circle, ${colorVar} 0%, transparent 65%)` }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colorVar}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          style={{ filter: `drop-shadow(0 0 8px ${colorVar})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">{label}</span>
        <span className="mt-1 text-5xl font-bold tracking-tight text-white sm:text-6xl">{primary}</span>
        <span className="mt-1 text-xs font-medium text-white/70">
          <AnimatedNumber value={percent} decimals={0} suffix="%" />
        </span>
      </div>
    </div>
  );
}

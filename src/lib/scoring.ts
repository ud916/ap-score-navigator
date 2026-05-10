import type { Subject, ExamScoring, APScoring, SATScoring, ACTScoring, RegentsScoring } from "@/data/subjects";

export type APInput = { mcqCorrect: number; frqScores: number[] };
export type SATInput = { rwCorrect: number; mathCorrect: number };
export type ACTInput = Record<string, number>; // sectionId -> correct
export type RegentsInput = { mcqCorrect: number; frqScores: number[] };

export type CalcResult = {
  /** A normalized 0-100 percent for charts. */
  percent: number;
  /** Primary score readable summary (e.g. "4 / 5", "1280", "27"). */
  primary: string;
  /** Sub-summary text. */
  secondary: string;
  /** Verdict bucket. */
  band: "Excellent" | "Good" | "Borderline" | "At Risk";
  /** AP 1-5 estimate when relevant. */
  apScore?: 1 | 2 | 3 | 4 | 5;
  /** Section breakdown for charts. */
  breakdown: { label: string; value: number; max: number }[];
  /** Ranged college readiness label. */
  readiness: string;
  /** 0-100 estimated percentile vs peers. */
  percentile: number;
};

const bandFromPercent = (p: number): CalcResult["band"] =>
  p >= 80 ? "Excellent" : p >= 60 ? "Good" : p >= 40 ? "Borderline" : "At Risk";

const readinessFromPercent = (p: number) =>
  p >= 85 ? "Highly competitive — top-tier ready"
  : p >= 70 ? "College ready — strong applicant"
  : p >= 50 ? "On track — keep practicing"
  : "Needs improvement";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calculateAP(cfg: APScoring, input: APInput): CalcResult {
  const mcqPct = cfg.mcq.count ? input.mcqCorrect / cfg.mcq.count : 0;
  const mcqWeighted = mcqPct * cfg.mcq.weight;
  let frqWeighted = 0;
  cfg.frqs.forEach((f, i) => {
    const earned = clamp(input.frqScores[i] ?? 0, 0, f.max);
    frqWeighted += (earned / f.max) * f.weight;
  });
  const composite = mcqWeighted + frqWeighted; // out of compositeMax
  const percent = clamp((composite / cfg.compositeMax) * 100, 0, 100);
  let apScore: 1 | 2 | 3 | 4 | 5 = 1;
  for (const t of cfg.thresholds) if (composite >= t.min) apScore = t.score;
  const band = apScore >= 4 ? "Excellent" : apScore === 3 ? "Good" : apScore === 2 ? "Borderline" : "At Risk";
  return {
    percent,
    primary: `${apScore} / 5`,
    secondary: `Composite ${composite.toFixed(1)} / ${cfg.compositeMax}`,
    band,
    apScore,
    breakdown: [
      { label: "MCQ", value: +mcqWeighted.toFixed(1), max: cfg.mcq.weight },
      ...cfg.frqs.map((f, i) => ({ label: f.name, value: +(((clamp(input.frqScores[i] ?? 0, 0, f.max)) / f.max) * f.weight).toFixed(1), max: f.weight })),
    ],
    readiness: readinessFromPercent(percent),
    percentile: Math.round(percent),
  };
}

/** Approximate raw -> 200-800 scaled SAT section. */
function satSection(raw: number, count: number) {
  const pct = count ? clamp(raw / count, 0, 1) : 0;
  // Non-linear curve approximating recent SAT sections.
  const scaled = 200 + Math.round(pct * 600);
  return scaled;
}

export function calculateSAT(cfg: SATScoring, input: SATInput): CalcResult {
  const rwCount = cfg.sections.find((s) => s.id === "rw")?.count ?? 54;
  const mathCount = cfg.sections.find((s) => s.id === "math")?.count ?? 44;
  const rw = satSection(input.rwCorrect, rwCount);
  const math = satSection(input.mathCorrect, mathCount);
  const total = rw + math;
  const percent = clamp(((total - 400) / 1200) * 100, 0, 100);
  return {
    percent,
    primary: `${total}`,
    secondary: `Reading & Writing ${rw} • Math ${math}`,
    band: bandFromPercent(percent),
    breakdown: [
      { label: "Reading & Writing", value: rw - 200, max: 600 },
      { label: "Math", value: math - 200, max: 600 },
    ],
    readiness: readinessFromPercent(percent),
    percentile: Math.round(percent),
  };
}

/** ACT raw -> 1-36 with a smooth curve. */
function actScale(raw: number, count: number) {
  const pct = count ? clamp(raw / count, 0, 1) : 0;
  return clamp(Math.round(1 + pct * 35), 1, 36);
}

export function calculateACT(cfg: ACTScoring, input: ACTInput): CalcResult {
  const sec = cfg.sections.map((s) => ({ id: s.id, name: s.name, max: s.count, scaled: actScale(input[s.id] ?? 0, s.count) }));
  const composite = Math.round(sec.reduce((sum, s) => sum + s.scaled, 0) / sec.length);
  const percent = clamp(((composite - 1) / 35) * 100, 0, 100);
  return {
    percent,
    primary: `${composite}`,
    secondary: sec.map((s) => `${s.name} ${s.scaled}`).join(" • "),
    band: bandFromPercent(percent),
    breakdown: sec.map((s) => ({ label: s.name, value: s.scaled, max: 36 })),
    readiness: readinessFromPercent(percent),
    percentile: Math.round(percent),
  };
}

export function calculateRegents(cfg: RegentsScoring, input: RegentsInput): CalcResult {
  const mcqRaw = clamp(input.mcqCorrect, 0, cfg.mcq.count) * cfg.mcq.pointsEach;
  const frqRaw = cfg.frqs.reduce((s, f, i) => s + clamp(input.frqScores[i] ?? 0, 0, f.max), 0);
  const totalRaw = mcqRaw + frqRaw;
  const totalMax = cfg.mcq.count * cfg.mcq.pointsEach + cfg.frqs.reduce((s, f) => s + f.max, 0);
  // Approximate scaled score: roughly linear with mild curve.
  const pct = totalMax ? totalRaw / totalMax : 0;
  const scaled = Math.round(clamp(pct * 100 + (pct > 0.4 ? 5 : 0), 0, 100));
  const percent = scaled;
  return {
    percent,
    primary: `${scaled}`,
    secondary: `Raw ${totalRaw} / ${totalMax} • Passing ${cfg.passing}`,
    band: scaled >= 85 ? "Excellent" : scaled >= cfg.passing ? "Good" : scaled >= cfg.passing - 10 ? "Borderline" : "At Risk",
    breakdown: [
      { label: "MCQ", value: mcqRaw, max: cfg.mcq.count * cfg.mcq.pointsEach },
      ...cfg.frqs.map((f, i) => ({ label: f.name, value: clamp(input.frqScores[i] ?? 0, 0, f.max), max: f.max })),
    ],
    readiness: readinessFromPercent(percent),
    percentile: Math.round(percent),
  };
}

export function calculate(subject: Subject, input: any): CalcResult {
  const s: ExamScoring = subject.scoring;
  if (s.kind === "ap") return calculateAP(s, input);
  if (s.kind === "sat") return calculateSAT(s, input);
  if (s.kind === "act") return calculateACT(s, input);
  return calculateRegents(s, input);
}

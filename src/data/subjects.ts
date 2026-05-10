// Comprehensive exam catalog with realistic scoring configuration.
// Note: thresholds are best-effort approximations of recent curves and are
// labelled as estimates throughout the UI.

export type Accent = "purple" | "blue" | "green" | "orange" | "pink" | "teal";

export type APThreshold = { score: 1 | 2 | 3 | 4 | 5; min: number };
export type FRQPart = { name: string; max: number; weight: number };

export type APScoring = {
  kind: "ap";
  mcq: { count: number; weight: number };
  frqs: FRQPart[];
  /** Total composite scale (max). */
  compositeMax: number;
  /** Sorted ascending by min. */
  thresholds: APThreshold[];
};

export type SATScoring = {
  kind: "sat";
  sections: { id: "rw" | "math"; name: string; count: number }[];
};

export type ACTScoring = {
  kind: "act";
  sections: { id: string; name: string; count: number }[];
};

export type RegentsScoring = {
  kind: "regents";
  mcq: { count: number; pointsEach: number };
  frqs: FRQPart[];
  /** Passing scaled score (typically 65). */
  passing: number;
};

export type ExamScoring = APScoring | SATScoring | ACTScoring | RegentsScoring;

export type Subject = {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  duration: string;
  accent: Accent;
  category:
    | "SAT, ACT & Test Prep"
    | "Sciences"
    | "Math"
    | "Social Studies"
    | "English Language Arts"
    | "Computer Science"
    | "World Languages";
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Approximate % of US test-takers earning 3+ (AP) or passing. */
  passRate?: number;
  /** Recent score distribution buckets summing to ~100. */
  distribution?: { label: string; pct: number }[];
  studyTips: string[];
  faqs: { q: string; a: string }[];
  scoring: ExamScoring;
};

export const categories = [
  "SAT, ACT & Test Prep",
  "Sciences",
  "Math",
  "Social Studies",
  "English Language Arts",
  "Computer Science",
  "World Languages",
] as const;

/** Standard AP threshold template: composite 0-100 mapped to 1-5. */
const apThresholds = (mins: [number, number, number, number]): APThreshold[] => [
  { score: 1, min: 0 },
  { score: 2, min: mins[0] },
  { score: 3, min: mins[1] },
  { score: 4, min: mins[2] },
  { score: 5, min: mins[3] },
];

/** Helper to build a typical AP config (60/40 MCQ/FRQ split, 100 composite). */
const apConfig = (
  mcqCount: number,
  frqs: FRQPart[],
  mins: [number, number, number, number] = [25, 45, 65, 80],
): APScoring => ({
  kind: "ap",
  mcq: { count: mcqCount, weight: 60 },
  frqs,
  compositeMax: 100,
  thresholds: apThresholds(mins),
});

const standardFRQs = (count: number, maxEach = 9, weightEach?: number): FRQPart[] => {
  const w = weightEach ?? +(40 / count).toFixed(2);
  return Array.from({ length: count }, (_, i) => ({
    name: `FRQ ${i + 1}`,
    max: maxEach,
    weight: w,
  }));
};

const distrib = (s5: number, s4: number, s3: number, s2: number, s1: number) => [
  { label: "5", pct: s5 },
  { label: "4", pct: s4 },
  { label: "3", pct: s3 },
  { label: "2", pct: s2 },
  { label: "1", pct: s1 },
];

const tips = (s: string) => [
  `Master the ${s} content outline — focus on highest-weighted units first.`,
  "Take 2+ full timed practice exams under realistic conditions.",
  "Review every missed question; track recurring mistake patterns.",
  "Memorize must-know formulas, dates, or vocab on spaced repetition.",
  "Practice writing FRQs with a strict timer to build pacing.",
];

const faqsFor = (s: string, dur: string) => [
  { q: `How long is the ${s} exam?`, a: `The exam runs ${dur} including all sections.` },
  { q: "What score is considered passing?", a: "A 3 or higher is generally considered passing and may earn college credit." },
  { q: "Is the calculator's estimate official?", a: "No. It's an estimate based on recent curves and is intended for self-review." },
  { q: "How accurate is the curve?", a: "We use recent published curves and weighting; final curves vary year to year." },
];

export const subjects: Subject[] = [
  // SAT/ACT/Test Prep
  {
    slug: "digital-sat",
    title: "Digital SAT",
    description: "Adaptive Reading, Writing, and Math sections scored 400–1600.",
    duration: "2h 14m",
    accent: "blue",
    category: "SAT, ACT & Test Prep",
    difficulty: 4,
    passRate: 0.6,
    distribution: [
      { label: "1400+", pct: 12 },
      { label: "1200-1399", pct: 28 },
      { label: "1000-1199", pct: 35 },
      { label: "<1000", pct: 25 },
    ],
    studyTips: tips("Digital SAT"),
    faqs: faqsFor("Digital SAT", "2h 14m"),
    scoring: {
      kind: "sat",
      sections: [
        { id: "rw", name: "Reading & Writing", count: 54 },
        { id: "math", name: "Math", count: 44 },
      ],
    },
  },
  {
    slug: "psat",
    title: "PSAT/NMSQT",
    description: "Practice SAT scored 320–1520 across Reading & Writing and Math.",
    duration: "2h 14m",
    accent: "blue",
    category: "SAT, ACT & Test Prep",
    difficulty: 3,
    studyTips: tips("PSAT"),
    faqs: faqsFor("PSAT", "2h 14m"),
    scoring: {
      kind: "sat",
      sections: [
        { id: "rw", name: "Reading & Writing", count: 54 },
        { id: "math", name: "Math", count: 44 },
      ],
    },
  },
  {
    slug: "act",
    title: "ACT",
    description: "English, Math, Reading, Science scored 1–36 each.",
    duration: "2h 55m",
    accent: "orange",
    category: "SAT, ACT & Test Prep",
    difficulty: 4,
    passRate: 0.5,
    distribution: [
      { label: "30+", pct: 10 },
      { label: "24-29", pct: 28 },
      { label: "18-23", pct: 38 },
      { label: "<18", pct: 24 },
    ],
    studyTips: tips("ACT"),
    faqs: faqsFor("ACT", "2h 55m"),
    scoring: {
      kind: "act",
      sections: [
        { id: "english", name: "English", count: 75 },
        { id: "math", name: "Math", count: 60 },
        { id: "reading", name: "Reading", count: 40 },
        { id: "science", name: "Science", count: 40 },
      ],
    },
  },
  {
    slug: "act-enhanced",
    title: "ACT Enhanced",
    description: "Updated ACT format with shorter sections, scored 1–36.",
    duration: "2h 5m",
    accent: "orange",
    category: "SAT, ACT & Test Prep",
    difficulty: 4,
    studyTips: tips("Enhanced ACT"),
    faqs: faqsFor("Enhanced ACT", "2h 5m"),
    scoring: {
      kind: "act",
      sections: [
        { id: "english", name: "English", count: 50 },
        { id: "math", name: "Math", count: 45 },
        { id: "reading", name: "Reading", count: 36 },
      ],
    },
  },
  {
    slug: "preact",
    title: "PreACT",
    description: "Pre-ACT diagnostic with English, Math, Reading, Science.",
    duration: "1h 55m",
    accent: "orange",
    category: "SAT, ACT & Test Prep",
    difficulty: 3,
    studyTips: tips("PreACT"),
    faqs: faqsFor("PreACT", "1h 55m"),
    scoring: {
      kind: "act",
      sections: [
        { id: "english", name: "English", count: 45 },
        { id: "math", name: "Math", count: 36 },
        { id: "reading", name: "Reading", count: 25 },
        { id: "science", name: "Science", count: 30 },
      ],
    },
  },

  // Sciences
  ap("ap-biology", "AP Biology", "Cells, genetics, evolution and ecology.", "3h", "green", 4, [22, 42, 60, 76], 60, standardFRQs(6, 8), distrib(8, 22, 38, 25, 7)),
  ap("ap-chemistry", "AP Chemistry", "Atomic structure, reactions and thermodynamics.", "3h 15m", "teal", 5, [28, 48, 65, 80], 60, standardFRQs(7, 8), distrib(13, 18, 27, 23, 19)),
  ap("ap-environmental-science", "AP Environmental Science", "Earth systems, populations, sustainability.", "2h 40m", "green", 3, [25, 45, 62, 78], 80, standardFRQs(3, 10), distrib(8, 27, 19, 26, 20)),
  ap("ap-physics-1", "AP Physics 1", "Algebra-based mechanics and intro physics.", "3h", "orange", 5, [30, 50, 68, 82], 50, standardFRQs(5, 7), distrib(7, 18, 21, 25, 29)),
  ap("ap-physics-2", "AP Physics 2", "Fluids, thermodynamics, electricity, optics.", "3h", "orange", 4, [28, 48, 66, 80], 50, standardFRQs(4, 10), distrib(15, 20, 35, 22, 8)),
  ap("ap-physics-c-em", "AP Physics C: E&M", "Calculus-based electricity and magnetism.", "1h 30m", "orange", 5, [25, 45, 62, 78], 35, standardFRQs(3, 15), distrib(35, 25, 12, 13, 15)),
  ap("ap-physics-c-mech", "AP Physics C: Mechanics", "Calculus-based mechanics for STEM majors.", "1h 30m", "orange", 5, [25, 45, 62, 78], 35, standardFRQs(3, 15), distrib(27, 27, 19, 12, 15)),
  ap("ap-psychology", "AP Psychology", "Behavior and mental processes.", "2h", "purple", 3, [30, 48, 65, 80], 75, standardFRQs(2, 7), distrib(17, 24, 18, 12, 29)),

  // Math
  reg("algebra-1-regents", "Algebra 1 Regents", "NY state Algebra 1 Regents exam.", "3h", "blue", 24, 2, [
    { name: "Part II", max: 8, weight: 0 },
    { name: "Part III", max: 16, weight: 0 },
    { name: "Part IV", max: 6, weight: 0 },
  ]),
  reg("algebra-2-regents", "Algebra 2 Regents", "NY state Algebra 2 Regents exam.", "3h", "blue", 24, 2, [
    { name: "Part II", max: 8, weight: 0 },
    { name: "Part III", max: 16, weight: 0 },
    { name: "Part IV", max: 6, weight: 0 },
  ]),
  ap("ap-calculus-ab", "AP Calculus AB", "Limits, derivatives, integrals and applications.", "3h 15m", "blue", 5, [25, 45, 62, 78], 45, standardFRQs(6, 9), distrib(22, 17, 19, 23, 19)),
  ap("ap-calculus-bc", "AP Calculus BC", "Calculus AB plus series and parametrics.", "3h 15m", "blue", 5, [27, 50, 68, 82], 45, standardFRQs(6, 9), distrib(45, 17, 18, 14, 6)),
  ap("ap-precalculus", "AP Precalculus", "Functions, modeling, trigonometry.", "3h", "blue", 3, [28, 48, 65, 80], 40, standardFRQs(4, 6), distrib(20, 25, 30, 15, 10)),
  ap("ap-statistics", "AP Statistics", "Data, probability and inference.", "3h", "green", 4, [25, 45, 62, 78], 40, standardFRQs(6, 4), distrib(15, 22, 23, 18, 22)),
  reg("geometry-regents", "Geometry Regents", "NY state Geometry Regents exam.", "3h", "blue", 24, 2, [
    { name: "Part II", max: 14, weight: 0 },
    { name: "Part III", max: 12, weight: 0 },
    { name: "Part IV", max: 6, weight: 0 },
  ]),
  reg("staar-algebra-1", "STAAR Algebra 1", "Texas STAAR Algebra 1 EOC.", "4h", "blue", 50, 1, [
    { name: "Open response", max: 4, weight: 0 },
  ]),

  // Social Studies
  ap("ap-african-american-studies", "AP African American Studies", "Histories, cultures and contributions.", "3h", "orange", 3, [25, 45, 62, 78], 55, standardFRQs(4, 7), distrib(11, 22, 30, 25, 12)),
  ap("ap-art-history", "AP Art History", "Global art across cultures and centuries.", "3h", "pink", 3, [27, 47, 64, 80], 80, standardFRQs(6, 8), distrib(13, 23, 27, 24, 13)),
  ap("ap-comparative-government", "AP Comparative Government", "Compare political systems across six countries.", "2h 30m", "blue", 3, [25, 45, 62, 78], 55, standardFRQs(4, 8), distrib(20, 21, 27, 17, 15)),
  ap("ap-european-history", "AP European History", "Cultural, economic and political history of Europe.", "3h 15m", "orange", 4, [28, 48, 65, 80], 55, standardFRQs(4, 7), distrib(15, 25, 30, 20, 10)),
  ap("ap-human-geography", "AP Human Geography", "Patterns of human activity on Earth's surface.", "2h 15m", "green", 3, [25, 45, 62, 78], 60, standardFRQs(3, 7), distrib(15, 22, 18, 25, 20)),
  ap("ap-macroeconomics", "AP Macroeconomics", "Macro principles and policy.", "2h 10m", "teal", 3, [25, 45, 62, 78], 60, standardFRQs(3, 10), distrib(20, 25, 25, 18, 12)),
  ap("ap-microeconomics", "AP Microeconomics", "Markets, firms and consumer theory.", "2h 10m", "teal", 3, [25, 45, 62, 78], 60, standardFRQs(3, 10), distrib(22, 25, 25, 17, 11)),
  ap("ap-us-government", "AP U.S. Government & Politics", "Constitution, institutions and political behavior.", "3h", "blue", 3, [25, 45, 62, 78], 55, standardFRQs(4, 6), distrib(13, 14, 23, 28, 22)),
  ap("ap-us-history", "AP U.S. History", "U.S. political, social, and economic history.", "3h 15m", "orange", 4, [27, 48, 65, 80], 55, standardFRQs(4, 7), distrib(11, 16, 22, 22, 29)),
  ap("ap-world-history", "AP World History: Modern", "Global processes from 1200 CE to present.", "3h 15m", "orange", 4, [27, 47, 64, 80], 55, standardFRQs(4, 7), distrib(14, 19, 27, 22, 18)),

  // English / ELA
  ap("ap-english-language", "AP English Language", "Rhetorical analysis and argumentative writing.", "3h 15m", "pink", 4, [27, 47, 64, 80], 45, standardFRQs(3, 6), distrib(10, 19, 27, 32, 12)),
  ap("ap-english-literature", "AP English Literature", "Close reading and literary analysis.", "3h", "pink", 4, [28, 48, 65, 80], 55, standardFRQs(3, 6), distrib(15, 26, 36, 16, 7)),
  ap("ap-music-theory", "AP Music Theory", "Aural skills, notation, harmony and analysis.", "2h 40m", "teal", 4, [27, 47, 64, 80], 75, standardFRQs(7, 9), distrib(22, 19, 27, 24, 8)),

  // CS
  ap("ap-computer-science-a", "AP Computer Science A", "Java fundamentals and OO design.", "3h", "purple", 4, [27, 48, 65, 80], 40, standardFRQs(4, 9), distrib(26, 22, 22, 13, 17)),
  ap("ap-computer-science-principles", "AP Computer Science Principles", "Computational thinking and creative problem solving.", "2h", "purple", 3, [25, 45, 62, 78], 70, standardFRQs(0, 0)
    .concat([{ name: "Create Performance Task", max: 6, weight: 16.7 }, { name: "Written Response", max: 8, weight: 16.7 }, { name: "Code Reasoning", max: 8, weight: 6.6 }]),
    distrib(11, 25, 28, 19, 17)),

  // World Languages
  ap("ap-french-language", "AP French Language", "Communication and culture in French.", "3h 5m", "purple", 4, [27, 47, 64, 80], 65, standardFRQs(4, 5), distrib(20, 35, 30, 12, 3)),
  ap("ap-german-language", "AP German Language", "Communication and culture in German.", "3h 5m", "purple", 4, [27, 47, 64, 80], 65, standardFRQs(4, 5), distrib(28, 36, 23, 11, 2)),
  ap("ap-latin", "AP Latin", "Translate Latin prose and poetry.", "3h", "purple", 5, [28, 48, 65, 80], 60, standardFRQs(5, 8), distrib(15, 26, 27, 19, 13)),
  ap("ap-spanish-language", "AP Spanish Language", "Communication and culture in Spanish.", "3h 5m", "purple", 3, [27, 47, 64, 80], 65, standardFRQs(4, 5), distrib(28, 33, 28, 9, 2)),
  ap("ap-spanish-literature", "AP Spanish Literature", "Spanish-language literary analysis.", "3h 5m", "purple", 4, [28, 48, 65, 80], 65, standardFRQs(4, 5), distrib(11, 25, 41, 18, 5)),
];

function ap(
  slug: string,
  title: string,
  description: string,
  duration: string,
  accent: Accent,
  difficulty: 1 | 2 | 3 | 4 | 5,
  thresholds: [number, number, number, number],
  mcqCount: number,
  frqs: FRQPart[],
  distribution: { label: string; pct: number }[],
): Subject {
  const cat: Subject["category"] =
    title.includes("Calculus") || title.includes("Statistics") || title.includes("Precalculus")
      ? "Math"
      : title.includes("Computer Science")
      ? "Computer Science"
      : title.includes("English") || title.includes("Music")
      ? "English Language Arts"
      : title.includes("Spanish") || title.includes("French") || title.includes("German") || title.includes("Latin")
      ? "World Languages"
      : title.includes("Biology") || title.includes("Chemistry") || title.includes("Physics") || title.includes("Environmental") || title.includes("Psychology")
      ? "Sciences"
      : "Social Studies";
  const passSum = distribution.slice(0, 3).reduce((s, d) => s + d.pct, 0);
  return {
    slug,
    title,
    description,
    duration,
    accent,
    category: cat,
    difficulty,
    passRate: passSum / 100,
    distribution,
    studyTips: tips(title),
    faqs: faqsFor(title, duration),
    scoring: apConfig(mcqCount, frqs, thresholds),
  };
}

function reg(
  slug: string,
  title: string,
  description: string,
  duration: string,
  accent: Accent,
  mcqCount: number,
  mcqPoints: number,
  frqs: FRQPart[],
): Subject {
  return {
    slug,
    title,
    description,
    duration,
    accent,
    category: "Math",
    difficulty: 2,
    studyTips: tips(title),
    faqs: faqsFor(title, duration),
    scoring: { kind: "regents", mcq: { count: mcqCount, pointsEach: mcqPoints }, frqs, passing: 65 },
  };
}

export const getSubjectBySlug = (slug: string) => subjects.find((s) => s.slug === slug);

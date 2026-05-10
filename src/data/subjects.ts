export type Subject = {
  slug: string;
  title: string;
  description: string;
  questions: number;
  duration: string;
  accent: "purple" | "blue" | "green" | "orange" | "pink" | "teal";
  category: string;
};

export const categories = [
  "History & Social Science",
  "Math & Computer Science",
  "Sciences",
  "English",
  "World Languages & Cultures",
  "Arts",
] as const;

export const subjects: Subject[] = [
  // History & Social Science
  { slug: "us-history", title: "AP U.S. History", description: "Analyze U.S. political, social, and economic history.", questions: 55, duration: "3h 15m", accent: "orange", category: "History & Social Science" },
  { slug: "world-history", title: "AP World History: Modern", description: "Global processes from 1200 CE to present.", questions: 55, duration: "3h 15m", accent: "orange", category: "History & Social Science" },
  { slug: "european-history", title: "AP European History", description: "Cultural, economic and political history of Europe.", questions: 55, duration: "3h 15m", accent: "orange", category: "History & Social Science" },
  { slug: "us-gov", title: "AP U.S. Government & Politics", description: "Constitution, institutions and political behavior.", questions: 55, duration: "3h", accent: "blue", category: "History & Social Science" },
  { slug: "comp-gov", title: "AP Comparative Government", description: "Compare political systems across six countries.", questions: 55, duration: "2h 30m", accent: "blue", category: "History & Social Science" },
  { slug: "psychology", title: "AP Psychology", description: "Behavior and mental processes from a scientific lens.", questions: 100, duration: "2h", accent: "purple", category: "History & Social Science" },
  { slug: "human-geo", title: "AP Human Geography", description: "Patterns of human activity on the Earth's surface.", questions: 60, duration: "2h 15m", accent: "green", category: "History & Social Science" },
  { slug: "macro", title: "AP Macroeconomics", description: "Economic principles applied to economic systems.", questions: 60, duration: "2h 10m", accent: "teal", category: "History & Social Science" },

  // Math & CS
  { slug: "calc-ab", title: "AP Calculus AB", description: "Limits, derivatives, integrals and applications.", questions: 45, duration: "3h 15m", accent: "blue", category: "Math & Computer Science" },
  { slug: "calc-bc", title: "AP Calculus BC", description: "Calculus AB plus series and parametric functions.", questions: 45, duration: "3h 15m", accent: "blue", category: "Math & Computer Science" },
  { slug: "stats", title: "AP Statistics", description: "Data exploration, sampling, inference and probability.", questions: 40, duration: "3h", accent: "green", category: "Math & Computer Science" },
  { slug: "precalc", title: "AP Precalculus", description: "Functions, modeling, trigonometry and more.", questions: 40, duration: "3h", accent: "blue", category: "Math & Computer Science" },
  { slug: "csa", title: "AP Computer Science A", description: "Java fundamentals and object-oriented design.", questions: 40, duration: "3h", accent: "purple", category: "Math & Computer Science" },
  { slug: "csp", title: "AP Computer Science Principles", description: "Computational thinking and creative problem solving.", questions: 70, duration: "2h", accent: "purple", category: "Math & Computer Science" },

  // Sciences
  { slug: "biology", title: "AP Biology", description: "Cellular processes, genetics, evolution and ecology.", questions: 60, duration: "3h", accent: "green", category: "Sciences" },
  { slug: "chemistry", title: "AP Chemistry", description: "Atomic structure, reactions and thermodynamics.", questions: 60, duration: "3h 15m", accent: "teal", category: "Sciences" },
  { slug: "physics-1", title: "AP Physics 1", description: "Algebra-based mechanics and introductory physics.", questions: 50, duration: "3h", accent: "orange", category: "Sciences" },
  { slug: "physics-2", title: "AP Physics 2", description: "Fluids, thermodynamics, electricity and optics.", questions: 50, duration: "3h", accent: "orange", category: "Sciences" },
  { slug: "physics-c-mech", title: "AP Physics C: Mechanics", description: "Calculus-based mechanics for STEM majors.", questions: 35, duration: "1h 30m", accent: "orange", category: "Sciences" },
  { slug: "physics-c-em", title: "AP Physics C: E&M", description: "Calculus-based electricity and magnetism.", questions: 35, duration: "1h 30m", accent: "orange", category: "Sciences" },
  { slug: "env-sci", title: "AP Environmental Science", description: "Earth systems, populations, pollution and sustainability.", questions: 80, duration: "2h 40m", accent: "green", category: "Sciences" },

  // English
  { slug: "eng-lang", title: "AP English Language", description: "Rhetorical analysis and argumentative writing.", questions: 45, duration: "3h 15m", accent: "pink", category: "English" },
  { slug: "eng-lit", title: "AP English Literature", description: "Close reading and literary analysis essays.", questions: 55, duration: "3h", accent: "pink", category: "English" },

  // Languages
  { slug: "spanish-lang", title: "AP Spanish Language", description: "Listening, reading, writing and speaking in Spanish.", questions: 65, duration: "3h 5m", accent: "purple", category: "World Languages & Cultures" },
  { slug: "french-lang", title: "AP French Language", description: "Communication and culture in French.", questions: 65, duration: "3h 5m", accent: "purple", category: "World Languages & Cultures" },
  { slug: "chinese-lang", title: "AP Chinese Language", description: "Mandarin language and Chinese culture.", questions: 70, duration: "2h 15m", accent: "purple", category: "World Languages & Cultures" },

  // Arts
  { slug: "art-history", title: "AP Art History", description: "Global art across cultures and centuries.", questions: 80, duration: "3h", accent: "pink", category: "Arts" },
  { slug: "music-theory", title: "AP Music Theory", description: "Aural skills, notation, harmony and analysis.", questions: 75, duration: "2h 40m", accent: "teal", category: "Arts" },
];

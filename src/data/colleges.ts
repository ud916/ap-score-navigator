export type CollegePolicy = {
  /** Subject slug → minimum AP score required (0 if not accepted). */
  [subjectSlug: string]: number;
};

export type College = {
  id: string;
  name: string;
  location: string;
  /** Annual tuition in USD. */
  tuition: number;
  /** Default minimum AP score for unlisted subjects. */
  defaultMin: number;
  /** Per-subject overrides. */
  policy: CollegePolicy;
  /** Credits awarded per qualifying AP exam (typical). */
  creditsPerExam: number;
};

export const colleges: College[] = [
  { id: "harvard", name: "Harvard University", location: "Cambridge, MA", tuition: 56550, defaultMin: 5, policy: { "ap-calculus-bc": 5, "ap-physics-c-mech": 5 }, creditsPerExam: 8 },
  { id: "stanford", name: "Stanford University", location: "Stanford, CA", tuition: 61731, defaultMin: 4, policy: { "ap-calculus-bc": 4, "ap-computer-science-a": 4 }, creditsPerExam: 5 },
  { id: "mit", name: "MIT", location: "Cambridge, MA", tuition: 60156, defaultMin: 5, policy: { "ap-calculus-bc": 5, "ap-physics-c-mech": 5, "ap-physics-c-em": 5, "ap-chemistry": 5, "ap-biology": 5 }, creditsPerExam: 9 },
  { id: "ucla", name: "UCLA", location: "Los Angeles, CA", tuition: 13804, defaultMin: 3, policy: {}, creditsPerExam: 8 },
  { id: "uc-berkeley", name: "UC Berkeley", location: "Berkeley, CA", tuition: 15891, defaultMin: 3, policy: {}, creditsPerExam: 5.3 },
  { id: "nyu", name: "New York University", location: "New York, NY", tuition: 60438, defaultMin: 4, policy: {}, creditsPerExam: 4 },
  { id: "princeton", name: "Princeton University", location: "Princeton, NJ", tuition: 59710, defaultMin: 5, policy: {}, creditsPerExam: 4 },
  { id: "columbia", name: "Columbia University", location: "New York, NY", tuition: 68400, defaultMin: 4, policy: { "ap-calculus-bc": 5 }, creditsPerExam: 3 },
  { id: "yale", name: "Yale University", location: "New Haven, CT", tuition: 64700, defaultMin: 5, policy: {}, creditsPerExam: 4 },
  { id: "duke", name: "Duke University", location: "Durham, NC", tuition: 66172, defaultMin: 4, policy: {}, creditsPerExam: 4 },
];

export function creditsAwarded(college: College, subjectSlug: string, score: number) {
  const min = college.policy[subjectSlug] ?? college.defaultMin;
  return score >= min ? college.creditsPerExam : 0;
}

/** Approximate per-credit cost. Most schools quote 30 credits/year. */
export function tuitionPerCredit(college: College) {
  return college.tuition / 30;
}

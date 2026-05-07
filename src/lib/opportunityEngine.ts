import jobsData from "../data/jobs.json";
import coursesData from "../data/courses.json";
import supportProgramsData from "../data/supportPrograms.json";
import mockUsersData from "../data/mockUsers.json";
import type {
  AccessLevel,
  CourseMatch,
  CourseOpportunity,
  EducationLevel,
  EmploymentStatus,
  JobMatch,
  JobOpportunity,
  MockAssessedUser,
  OpportunityAnalysis,
  ReadinessLevel,
  ScoreBreakdown,
  SocialStatus,
  SupportMatch,
  SupportProgram,
  UserProfile,
} from "../types";

export const jobs = jobsData as JobOpportunity[];
export const courses = coursesData as CourseOpportunity[];
export const supportPrograms = supportProgramsData as SupportProgram[];
export const mockUsers = mockUsersData as MockAssessedUser[];

const skillAliases: Record<string, string[]> = {
  "Attention to detail": ["attention to detail", "accuracy", "detail oriented", "quality checking"],
  "Basic computer skills": ["basic computer", "computer basics", "ms office", "office tools"],
  "Calendar management": ["calendar", "scheduling", "appointments"],
  Canva: ["canva", "layout", "poster"],
  "Computer literacy": ["computer literacy", "computer literate", "computer", "digital literacy"],
  "Customer service": ["customer service", "client support", "front desk"],
  "Data entry": ["data entry", "data encoder", "encoding"],
  "Document scanning": ["document scanning", "scan", "scanning"],
  Email: ["email", "gmail", "inbox"],
  "English communication": ["english", "communication", "call center", "speaking"],
  Excel: ["excel", "spreadsheet", "spreadsheets", "microsoft excel"],
  "Facebook page management": ["facebook page", "social media page", "page management"],
  "Forms processing": ["forms", "application form", "processing"],
  "Google Sheets": ["google sheets", "sheets"],
  "Google Workspace": ["google workspace", "google docs", "google drive"],
  "Internet use": ["internet", "online research", "web browsing"],
  "Interview readiness": ["interview", "mock interview"],
  "Job readiness": ["job readiness", "work readiness", "career readiness"],
  "Resume writing": ["resume", "cv", "biodata"],
  Typing: ["typing", "keyboard", "wpm"],
  Writing: ["writing", "caption", "copywriting"],
};

const educationRank: Record<EducationLevel, number> = {
  "Elementary Graduate": 1,
  "High School Graduate": 2,
  "Senior High School Graduate": 3,
  "Vocational Graduate": 4,
  "College Level": 4,
  "College Graduate": 5,
};

const accessScore: Record<AccessLevel, number> = {
  Reliable: 10,
  Shared: 7,
  Limited: 4,
  None: 1,
};

const employmentScore: Record<EmploymentStatus, number> = {
  Student: 6,
  "Out-of-school youth": 3,
  Unemployed: 4,
  "Fresh graduate": 8,
  "Part-time worker": 7,
  "Employed but seeking better work": 9,
};

const socialBarrierScore: Record<SocialStatus, number> = {
  "Low income": 7,
  "Solo parent household": 8,
  "Rural or relocation area": 8,
  "Person with disability": 8,
  "Indigenous community": 7,
  "No major barrier": 15,
};

export function calculateOpportunityAnalysis(
  profile: UserProfile,
  extractedText: string,
): OpportunityAnalysis {
  const detectedSkills = detectSkills(`${profile.currentSkills} ${profile.careerInterest} ${extractedText}`);
  const topJobs = rankJobs(profile, detectedSkills);
  const missingSkills = unique(topJobs.flatMap((match) => match.missingSkills)).slice(0, 8);
  const topCourses = rankCourses(missingSkills, detectedSkills);
  const topSupportPrograms = rankSupportPrograms(profile);

  const breakdown = calculateScoreBreakdown(profile, extractedText, topJobs);
  const score = clampScore(Object.values(breakdown).reduce((sum, value) => sum + value, 0));
  const readinessLevel = classifyScore(score);
  const jobMatchPercentage = topJobs[0]?.matchPercentage ?? 0;
  const skillGapPercentage = calculateSkillGapPercentage(topJobs);
  const nextSteps = generateNextSteps(missingSkills, topCourses, topJobs, topSupportPrograms);
  const pathway = generatePathway(profile, score, topJobs, missingSkills, nextSteps);
  const documentInsights = buildDocumentInsights(extractedText, detectedSkills, missingSkills);
  const summary = `Based on your profile, your current opportunity score is ${score}/100. You are best matched for ${topJobs
    .slice(0, 3)
    .map((match) => match.job.title)
    .join(", ")} pathways in the Filipino market. Your biggest skill gaps are ${formatList(missingSkills.slice(0, 3))}.`;

  return {
    score,
    readinessLevel,
    breakdown,
    detectedSkills,
    missingSkills,
    skillGapPercentage,
    jobMatchPercentage,
    topJobs,
    topCourses,
    topSupportPrograms,
    nextSteps,
    pathway,
    summary,
    documentInsights,
  };
}

export function detectSkills(input: string): string[] {
  const normalized = input.toLowerCase();
  const skills = Object.entries(skillAliases)
    .filter(([skill, aliases]) => {
      const searchTerms = [skill, ...aliases].map((term) => term.toLowerCase());
      return searchTerms.some((term) => normalized.includes(term));
    })
    .map(([skill]) => skill);

  return unique(skills);
}

export function classifyScore(score: number): ReadinessLevel {
  if (score <= 40) return "High support needed";
  if (score <= 70) return "Moderate support needed";
  return "Opportunity-ready";
}

export function rankJobs(profile: UserProfile, detectedSkills: string[]): JobMatch[] {
  return jobs
    .map((job) => {
      const required = job.requiredSkills;
      const matchedSkills = required.filter((skill) => hasSkill(detectedSkills, skill));
      const missingSkills = required.filter((skill) => !hasSkill(detectedSkills, skill));
      const skillScore = required.length === 0 ? 0 : (matchedSkills.length / required.length) * 75;
      const educationScore = educationRank[profile.educationLevel] >= educationRank[job.education] ? 20 : 8;
      const interestScore = profile.careerInterest.toLowerCase().includes(job.title.toLowerCase().split(" ")[0])
        ? 5
        : 0;

      return {
        job,
        matchPercentage: Math.round(Math.min(100, skillScore + educationScore + interestScore)),
        matchedSkills,
        missingSkills,
      };
    })
    .sort((left, right) => right.matchPercentage - left.matchPercentage)
    .slice(0, 3);
}

export function rankCourses(missingSkills: string[], detectedSkills: string[]): CourseMatch[] {
  return courses
    .map((course) => {
      const matchedGapSkills = course.skills.filter((skill) => missingSkills.some((gap) => sameSkill(gap, skill)));
      const alreadyHas = course.skills.filter((skill) => detectedSkills.some((detected) => sameSkill(detected, skill)));
      const relevancePercentage = Math.min(100, matchedGapSkills.length * 45 + alreadyHas.length * 10 + 20);

      return {
        course,
        relevancePercentage,
        matchedGapSkills,
      };
    })
    .sort((left, right) => right.relevancePercentage - left.relevancePercentage)
    .slice(0, 3);
}

export function rankSupportPrograms(profile: UserProfile): SupportMatch[] {
  const context = [
    profile.socialStatus,
    profile.employmentStatus,
    profile.internetAccess === "Limited" || profile.internetAccess === "None" ? "Limited internet" : "",
    profile.deviceAccess === "Shared" ? "Shared device" : "",
    profile.deviceAccess === "Limited" || profile.deviceAccess === "None" ? "Shared device" : "",
  ]
    .join(" ")
    .toLowerCase();

  return supportPrograms
    .map((program) => {
      const matchedEligibility = program.eligibility.filter((item) => context.includes(item.toLowerCase()));
      const relevancePercentage = Math.min(100, matchedEligibility.length * 35 + 30);

      return {
        program,
        relevancePercentage,
        matchedEligibility,
      };
    })
    .sort((left, right) => right.relevancePercentage - left.relevancePercentage)
    .slice(0, 3);
}

export function calculateScoreBreakdown(
  profile: UserProfile,
  extractedText: string,
  topJobs: JobMatch[],
): ScoreBreakdown {
  const topJobMatch = topJobs[0]?.matchPercentage ?? 0;
  const educationReadiness = Math.round((educationRank[profile.educationLevel] / 5) * 20);
  const skillsReadiness = Math.round((topJobMatch / 100) * 25);
  const accessReadiness = accessScore[profile.internetAccess] + accessScore[profile.deviceAccess];
  const employmentReadiness = employmentScore[profile.employmentStatus];
  const socialBarrierReadiness = socialBarrierScore[profile.socialStatus];
  const documentReadiness = extractedText.trim().length > 80 ? 10 : extractedText.trim().length > 0 ? 6 : 0;

  return {
    educationReadiness,
    skillsReadiness,
    accessReadiness,
    employmentReadiness,
    socialBarrierReadiness,
    documentReadiness,
  };
}

export function buildDashboardMetrics(current?: OpportunityAnalysis) {
  const currentUser: MockAssessedUser | null = current
    ? {
        id: "current",
        location: "Current assessment",
        readinessLevel: current.readinessLevel,
        score: current.score,
        skillGaps: current.missingSkills.slice(0, 4),
        roleMatches: current.topJobs.length,
        courseMatches: current.topCourses.length,
      }
    : null;

  const users = currentUser ? [...mockUsers, currentUser] : mockUsers;
  const readinessCounts = countBy(users.map((user) => user.readinessLevel));
  const gapCounts = countBy(users.flatMap((user) => user.skillGaps));
  const locationCounts = countBy(users.map((user) => user.location));
  const averageScore = Math.round(users.reduce((sum, user) => sum + user.score, 0) / users.length);

  return {
    totalUsers: users.length,
    averageScore,
    totalRoleMatches: users.reduce((sum, user) => sum + user.roleMatches, 0),
    totalCourseMatches: users.reduce((sum, user) => sum + user.courseMatches, 0),
    highSupportUsers: users.filter((user) => user.readinessLevel === "High support needed").length,
    readinessChart: Object.entries(readinessCounts).map(([name, value]) => ({ name, value })),
    skillGapChart: Object.entries(gapCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 6),
    matchChart: [
      { name: "Role matches", value: users.reduce((sum, user) => sum + user.roleMatches, 0) },
      { name: "Course matches", value: users.reduce((sum, user) => sum + user.courseMatches, 0) },
      { name: "High-support users", value: users.filter((user) => user.readinessLevel === "High support needed").length },
    ],
    locationChart: Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 6),
  };
}

function calculateSkillGapPercentage(topJobs: JobMatch[]): number {
  const requiredSkills = unique(topJobs.flatMap((match) => match.job.requiredSkills));
  const missingSkills = unique(topJobs.flatMap((match) => match.missingSkills));

  if (requiredSkills.length === 0) return 0;
  return Math.round((missingSkills.length / requiredSkills.length) * 100);
}

function generateNextSteps(
  missingSkills: string[],
  topCourses: CourseMatch[],
  topJobs: JobMatch[],
  topSupportPrograms: SupportMatch[],
): string[] {
  const firstCourse = topCourses[0]?.course.name ?? "Basic Digital Skills";
  const firstJob = topJobs[0]?.job.title ?? "entry-level work";
  const firstSupport = topSupportPrograms[0]?.program.name ?? "local education or training support";
  const firstGap = missingSkills[0] ?? "job readiness";

  return [
    `Take ${firstCourse} to improve ${firstGap}.`,
    `Revise your resume using the extracted document details and prepare for ${firstJob} applications.`,
    `Check eligibility for ${firstSupport} through your school, barangay, or local youth office.`,
  ];
}

function generatePathway(
  profile: UserProfile,
  score: number,
  topJobs: JobMatch[],
  missingSkills: string[],
  nextSteps: string[],
): string {
  const supportPhrase =
    score <= 40 ? "start with access and foundational digital support" : score <= 70 ? "build two missing skills" : "apply while strengthening one priority skill";

  return `${profile.name || "The candidate"} should ${supportPhrase}, then target ${topJobs[0]?.job.title ?? "an entry-level role"}. Priority gaps: ${formatList(
    missingSkills.slice(0, 3),
  )}. Next move: ${nextSteps[0]}`;
}

function buildDocumentInsights(extractedText: string, detectedSkills: string[], missingSkills: string[]): string[] {
  const insights = [
    extractedText.trim().length > 80
      ? "Document has enough readable text for profile scoring."
      : "Resume signal is limited; add a clearer resume for stronger matching.",
    detectedSkills.length > 0
      ? `Detected ${detectedSkills.length} marketable skill signal${detectedSkills.length === 1 ? "" : "s"}.`
      : "No clear skill signals were detected from the uploaded document.",
    missingSkills.length > 0
      ? `Top development focus: ${formatList(missingSkills.slice(0, 2))}.`
      : "Current document covers the core skills for the top matched roles.",
  ];

  return insights;
}

function hasSkill(detectedSkills: string[], requiredSkill: string): boolean {
  return detectedSkills.some((skill) => sameSkill(skill, requiredSkill));
}

function sameSkill(left: string, right: string): boolean {
  const leftLower = left.toLowerCase();
  const rightLower = right.toLowerCase();
  const rightAliases = skillAliases[right] ?? [];
  const leftAliases = skillAliases[left] ?? [];

  return (
    leftLower === rightLower ||
    rightAliases.some((alias) => leftLower.includes(alias.toLowerCase())) ||
    leftAliases.some((alias) => rightLower.includes(alias.toLowerCase()))
  );
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function formatList(values: string[]): string {
  if (values.length === 0) return "job readiness";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

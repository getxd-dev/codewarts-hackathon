export type EducationLevel =
  | "Elementary Graduate"
  | "High School Graduate"
  | "Senior High School Graduate"
  | "Vocational Graduate"
  | "College Level"
  | "College Graduate";

export type EmploymentStatus =
  | "Student"
  | "Out-of-school youth"
  | "Unemployed"
  | "Fresh graduate"
  | "Part-time worker"
  | "Employed but seeking better work";

export type SocialStatus =
  | "Low income"
  | "Solo parent household"
  | "Rural or relocation area"
  | "Person with disability"
  | "Indigenous community"
  | "No major barrier";

export type AccessLevel = "Reliable" | "Shared" | "Limited" | "None";

export type DocumentType = "Resume";

export type ReadinessLevel = "High support needed" | "Moderate support needed" | "Opportunity-ready";

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  educationLevel: EducationLevel;
  employmentStatus: EmploymentStatus;
  currentSkills: string;
  careerInterest: string;
  socialStatus: SocialStatus;
  internetAccess: AccessLevel;
  deviceAccess: AccessLevel;
}

export interface JobOpportunity {
  title: string;
  requiredSkills: string[];
  education: EducationLevel;
  location: string;
  companyName?: string;
  employmentType?: string;
  payRange?: string;
  source?: string;
  sourceUrl?: string;
  description?: string;
  contact?: string;
  createdAt?: string;
}

export interface EmployerJobOffer {
  id: string;
  companyName: string;
  title: string;
  location: string;
  workSetup: "Remote" | "Hybrid" | "Onsite";
  employmentType: "Full-time" | "Part-time" | "Internship" | "Project-based";
  payRange: string;
  education: EducationLevel;
  requiredSkills: string[];
  description: string;
  contact: string;
  createdAt: string;
}

export interface GeneratedResume {
  templateName: string;
  generatedText: string;
  photoDataUrl?: string;
  createdAt: string;
}

export interface CourseOpportunity {
  name: string;
  skills: string[];
  provider: string;
  sourceUrl: string;
  level: string;
  costLabel: string;
}

export interface SupportProgram {
  name: string;
  eligibility: string[];
  source?: string;
  sourceUrl?: string;
}

export interface OcrResult {
  extractedText: string;
  confidence: number;
  method: string;
  detectedDocumentType: DocumentType;
  highlights: string[];
  analyzer: string;
  model?: string;
  candidateName?: string;
  warnings?: string[];
}

export interface RecommendationInsight {
  reason: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface JobMatch {
  job: JobOpportunity;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  insight?: RecommendationInsight;
}

export interface CourseMatch {
  course: CourseOpportunity;
  relevancePercentage: number;
  matchedGapSkills: string[];
  insight?: RecommendationInsight;
}

export interface SupportMatch {
  program: SupportProgram;
  relevancePercentage: number;
  matchedEligibility: string[];
  insight?: RecommendationInsight;
}

export interface ScoreBreakdown {
  educationReadiness: number;
  skillsReadiness: number;
  accessReadiness: number;
  employmentReadiness: number;
  socialBarrierReadiness: number;
  documentReadiness: number;
}

export interface OpportunityAnalysis {
  score: number;
  readinessLevel: ReadinessLevel;
  breakdown: ScoreBreakdown;
  detectedSkills: string[];
  missingSkills: string[];
  skillGapPercentage: number;
  jobMatchPercentage: number;
  topJobs: JobMatch[];
  topCourses: CourseMatch[];
  topSupportPrograms: SupportMatch[];
  nextSteps: string[];
  pathway: string;
  summary: string;
  documentInsights: string[];
  recommendationModel?: string;
}

export interface MockAssessedUser {
  id: string;
  location: string;
  readinessLevel: ReadinessLevel;
  score: number;
  skillGaps: string[];
  roleMatches: number;
  courseMatches: number;
}

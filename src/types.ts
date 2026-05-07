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

export type DocumentType = "Resume" | "Certificate" | "School Record" | "Handwritten Form";

export type ReadinessLevel = "High support needed" | "Moderate support needed" | "Opportunity-ready";

export type SdgTag = "SDG 4" | "SDG 8" | "SDG 10" | "SDG 11";

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
  sdg: SdgTag[];
}

export interface CourseOpportunity {
  name: string;
  skills: string[];
  provider: string;
  sdg: SdgTag[];
}

export interface SupportProgram {
  name: string;
  eligibility: string[];
  sdg: SdgTag[];
}

export interface OcrResult {
  extractedText: string;
  confidence: number;
  method: string;
  detectedDocumentType: DocumentType;
  highlights: string[];
}

export interface JobMatch {
  job: JobOpportunity;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CourseMatch {
  course: CourseOpportunity;
  relevancePercentage: number;
  matchedGapSkills: string[];
}

export interface SupportMatch {
  program: SupportProgram;
  relevancePercentage: number;
  matchedEligibility: string[];
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
  sdgImpact: Record<SdgTag, number>;
}

export interface MockAssessedUser {
  id: string;
  location: string;
  readinessLevel: ReadinessLevel;
  score: number;
  skillGaps: string[];
  sdgRecommendations: SdgTag[];
}

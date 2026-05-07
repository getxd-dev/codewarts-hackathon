import { courses, jobs, supportPrograms } from "./opportunityEngine";
import type {
  CourseMatch,
  JobMatch,
  OcrResult,
  OpportunityAnalysis,
  SupportMatch,
  UserProfile,
} from "../types";

interface GeminiRecommendationsResponse {
  summary: string;
  pathway: string;
  nextSteps: string[];
  documentInsights: string[];
  topJobs: Array<{
    title: string;
    matchPercentage: number;
    reason: string;
    sourceLabel: string;
    sourceUrl: string;
  }>;
  topCourses: Array<{
    name: string;
    relevancePercentage: number;
    reason: string;
    sourceLabel: string;
    sourceUrl: string;
  }>;
  topSupportPrograms: Array<{
    name: string;
    relevancePercentage: number;
    reason: string;
    sourceLabel: string;
    sourceUrl: string;
  }>;
  model: string;
}

export async function enrichAnalysisWithGemini(
  profile: UserProfile,
  document: OcrResult,
  baseline: OpportunityAnalysis,
): Promise<OpportunityAnalysis> {
  try {
    const response = await fetch("/api/gemini/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        document,
        baseline,
        marketData: {
          jobs,
          courses,
          supportPrograms,
        },
      }),
    });

    if (!response.ok) return baseline;

    const gemini = (await response.json()) as GeminiRecommendationsResponse;

    return {
      ...baseline,
      summary: gemini.summary || baseline.summary,
      pathway: gemini.pathway || baseline.pathway,
      nextSteps: normalizeList(gemini.nextSteps, baseline.nextSteps, 3),
      documentInsights: normalizeList(gemini.documentInsights, baseline.documentInsights, 3),
      topJobs: mergeJobs(baseline.topJobs, gemini.topJobs),
      topCourses: mergeCourses(baseline.topCourses, gemini.topCourses),
      topSupportPrograms: mergeSupport(baseline.topSupportPrograms, gemini.topSupportPrograms),
      recommendationModel: gemini.model,
    };
  } catch {
    return baseline;
  }
}

function mergeJobs(base: JobMatch[], ranked: GeminiRecommendationsResponse["topJobs"]): JobMatch[] {
  const merged = ranked
    .map<JobMatch | null>((item) => {
      const baseMatch = base.find((match) => same(match.job.title, item.title));
      if (!baseMatch) return null;

      const match: JobMatch = {
        ...baseMatch,
        matchPercentage: clamp(item.matchPercentage || baseMatch.matchPercentage),
        insight: {
          reason: item.reason,
          sourceLabel: item.sourceLabel || baseMatch.job.source || "Role source",
          sourceUrl: baseMatch.job.sourceUrl || item.sourceUrl,
        },
      };
      return match;
    })
    .filter(isNonNull);

  return fillToThree(merged, base, (match) => match.job.title);
}

function mergeCourses(base: CourseMatch[], ranked: GeminiRecommendationsResponse["topCourses"]): CourseMatch[] {
  const merged = ranked
    .map<CourseMatch | null>((item) => {
      const baseMatch = base.find((match) => same(match.course.name, item.name));
      if (!baseMatch) return null;

      const match: CourseMatch = {
        ...baseMatch,
        relevancePercentage: clamp(item.relevancePercentage || baseMatch.relevancePercentage),
        insight: {
          reason: item.reason,
          sourceLabel: item.sourceLabel || baseMatch.course.provider,
          sourceUrl: baseMatch.course.sourceUrl || item.sourceUrl,
        },
      };
      return match;
    })
    .filter(isNonNull);

  return fillToThree(merged, base, (match) => match.course.name);
}

function mergeSupport(base: SupportMatch[], ranked: GeminiRecommendationsResponse["topSupportPrograms"]): SupportMatch[] {
  const merged = ranked
    .map<SupportMatch | null>((item) => {
      const baseMatch = base.find((match) => same(match.program.name, item.name));
      if (!baseMatch) return null;

      const match: SupportMatch = {
        ...baseMatch,
        relevancePercentage: clamp(item.relevancePercentage || baseMatch.relevancePercentage),
        insight: {
          reason: item.reason,
          sourceLabel: item.sourceLabel || baseMatch.program.source || "Support source",
          sourceUrl: baseMatch.program.sourceUrl || item.sourceUrl,
        },
      };
      return match;
    })
    .filter(isNonNull);

  return fillToThree(merged, base, (match) => match.program.name);
}

function isNonNull<T>(value: T | null): value is T {
  return value !== null;
}

function fillToThree<T>(ranked: T[], base: T[], key: (item: T) => string): T[] {
  const seen = new Set(ranked.map(key));
  const rest = base.filter((item) => !seen.has(key(item)));
  return [...ranked, ...rest].slice(0, 3);
}

function normalizeList(values: string[], fallback: string[], count: number): string[] {
  const clean = values?.map((value) => value.trim()).filter(Boolean) ?? [];
  return clean.length > 0 ? clean.slice(0, count) : fallback;
}

function same(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

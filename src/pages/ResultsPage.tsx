import { ArrowRight, BriefcaseBusiness, GraduationCap, HandHeart, ListChecks, Sparkles, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";
import { OpportunityCard } from "../components/OpportunityCard";
import { ProgressBar } from "../components/ProgressBar";
import { ScoreRing } from "../components/ScoreRing";
import { SectionHeader } from "../components/SectionHeader";
import { demoProfile, sampleProfile } from "../lib/demoProfile";
import { calculateOpportunityAnalysis } from "../lib/opportunityEngine";
import { loadAnalysis, loadOcrResult, loadProfile } from "../lib/storage";
import type { OpportunityAnalysis } from "../types";

const demoAnalysis = calculateOpportunityAnalysis(
  sampleProfile,
  "Resume detected: typing, email, basic computer skills, data entry, Facebook page management, and customer service exposure.",
);

export function ResultsPage() {
  const profile = loadProfile() ?? sampleProfile ?? demoProfile;
  const ocrResult = loadOcrResult();
  const analysis: OpportunityAnalysis = loadAnalysis() ?? demoAnalysis;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="AI Screening"
        title={`${profile.name || "Your"} match report`}
        copy={analysis.summary}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <ScoreRing score={analysis.score} level={analysis.readinessLevel} />
          <div className="mt-7 space-y-4">
            <MetricCard label="Best job match" value={`${analysis.jobMatchPercentage}%`} icon={BriefcaseBusiness} tone="blue" />
            <MetricCard label="Skill gap" value={`${analysis.skillGapPercentage}%`} icon={Target} tone="gold" />
          </div>
        </div>

        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-bayanihan-green/10 text-bayanihan-green">
              <Sparkles size={24} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-bayanihan-ink">Personalized pathway</h2>
              <p className="text-sm text-bayanihan-muted">
                Generated from profile, resume analysis, local market data
                {analysis.recommendationModel ? `, and ${analysis.recommendationModel}` : ""}
              </p>
            </div>
          </div>
          <p className="rounded-lg border border-bayanihan-border bg-bayanihan-mist p-4 leading-7 text-bayanihan-ink">
            {analysis.pathway}
          </p>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase text-bayanihan-green">Next 3 steps</h3>
            <ol className="space-y-3">
              {analysis.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-lg border border-bayanihan-border bg-white p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bayanihan-blue text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="leading-7 text-bayanihan-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <h2 className="mb-5 text-xl font-bold text-bayanihan-ink">Score breakdown</h2>
          <div className="space-y-5">
            <ProgressBar label="Education readiness" value={analysis.breakdown.educationReadiness} max={20} tone="green" />
            <ProgressBar label="Skills readiness" value={analysis.breakdown.skillsReadiness} max={25} tone="blue" />
            <ProgressBar label="Internet and device access" value={analysis.breakdown.accessReadiness} max={20} tone="gold" />
            <ProgressBar label="Employment status" value={analysis.breakdown.employmentReadiness} max={10} tone="green" />
            <ProgressBar label="Income and social barriers" value={analysis.breakdown.socialBarrierReadiness} max={15} tone="red" />
            <ProgressBar label="Document availability" value={analysis.breakdown.documentReadiness} max={10} tone="blue" />
          </div>
        </div>

        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <h2 className="mb-5 text-xl font-bold text-bayanihan-ink">Extracted skills and gaps</h2>
          <div>
            <h3 className="mb-2 text-sm font-bold text-bayanihan-ink">Detected skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.detectedSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-bayanihan-green/10 px-3 py-1 text-sm font-semibold text-bayanihan-green">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-bayanihan-ink">Missing skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-bayanihan-gold/15 px-3 py-1 text-sm font-semibold text-amber-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {ocrResult ? (
            <div className="mt-5 rounded-md border border-bayanihan-border bg-bayanihan-mist p-4 text-sm leading-7 text-bayanihan-muted">
              Document confidence: <strong>{ocrResult.confidence}%</strong>. Method: {ocrResult.method}
              {ocrResult.model ? ` (${ocrResult.model})` : ""}.
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <RecommendationSection
          icon={BriefcaseBusiness}
          title="Top jobs"
          children={analysis.topJobs.map((match) => (
            <OpportunityCard
              key={match.job.title}
              title={match.job.title}
              subtitle={match.job.location}
              metric={`${match.matchPercentage}%`}
              details={[
                `Required education: ${match.job.education}`,
                `Pay signal: ${match.job.payRange ?? "Varies by employer"}`,
                `Matched: ${match.matchedSkills.join(", ") || "Needs training"}`,
                `Gaps: ${match.missingSkills.join(", ") || "No major skill gap"}`,
                match.insight?.reason ? `Gemini analysis: ${match.insight.reason}` : `Source: ${match.job.source ?? "Local pathway"}`,
              ]}
              href={match.insight?.sourceUrl || match.job.sourceUrl}
              actionLabel="Search roles"
            />
          ))}
        />
        <RecommendationSection
          icon={GraduationCap}
          title="Available Courses"
          children={analysis.topCourses.map((match) => (
            <OpportunityCard
              key={match.course.name}
              title={match.course.name}
              subtitle={match.course.provider}
              metric={`${match.relevancePercentage}%`}
              details={[
                `Level: ${match.course.level}`,
                `Access: ${match.course.costLabel}`,
                `Builds: ${match.course.skills.join(", ")}`,
                `Covers gaps: ${match.matchedGapSkills.join(", ") || "General readiness"}`,
                match.insight?.reason ? `Gemini analysis: ${match.insight.reason}` : `Source: ${match.course.provider}`,
              ]}
              href={match.insight?.sourceUrl || match.course.sourceUrl}
              actionLabel="Open course"
            />
          ))}
        />
        <RecommendationSection
          icon={HandHeart}
          title="Support"
          children={analysis.topSupportPrograms.map((match) => (
            <OpportunityCard
              key={match.program.name}
              title={match.program.name}
              subtitle="Scholarship or support program"
              metric={`${match.relevancePercentage}%`}
              details={[
                `Eligibility: ${match.program.eligibility.join(", ")}`,
                `Matched: ${match.matchedEligibility.join(", ") || "General support"}`,
                match.insight?.reason ? `Gemini analysis: ${match.insight.reason}` : `Source: ${match.program.source ?? "Local referral"}`,
              ]}
              href={match.insight?.sourceUrl || match.program.sourceUrl}
              actionLabel="View source"
            />
          ))}
        />
      </div>

      <div className="mt-6 rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-bayanihan-ink">
              <ListChecks size={22} aria-hidden="true" />
              Market fit summary
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-bayanihan-muted md:grid-cols-3">
              {analysis.documentInsights.map((insight) => (
                <li key={insight} className="rounded-md border border-bayanihan-border bg-bayanihan-mist p-3">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-bayanihan-blue px-5 font-bold text-white transition hover:bg-blue-800"
          >
            Open Employer Dashboard
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RecommendationSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-bayanihan-ink">
        <Icon size={22} aria-hidden="true" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

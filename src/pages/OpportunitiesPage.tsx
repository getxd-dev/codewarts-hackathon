import { BriefcaseBusiness, GraduationCap, HandHeart, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { OpportunityCard } from "../components/OpportunityCard";
import { SectionHeader } from "../components/SectionHeader";
import { courses, jobs, supportPrograms } from "../lib/opportunityEngine";

type OpportunityTab = "Jobs" | "Courses" | "Support";

const tabs: { name: OpportunityTab; icon: LucideIcon }[] = [
  { name: "Jobs", icon: BriefcaseBusiness },
  { name: "Courses", icon: GraduationCap },
  { name: "Support", icon: HandHeart },
];

export function OpportunitiesPage() {
  const [tab, setTab] = useState<OpportunityTab>("Jobs");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.toLowerCase();

  const content = useMemo(() => {
    if (tab === "Jobs") {
      return jobs
        .filter((job) => `${job.title} ${job.requiredSkills.join(" ")} ${job.location}`.toLowerCase().includes(normalizedQuery))
        .map((job) => (
          <OpportunityCard
            key={job.title}
            title={job.title}
            subtitle={job.location}
            details={[`Required skills: ${job.requiredSkills.join(", ")}`, `Education: ${job.education}`]}
            sdg={job.sdg}
          />
        ));
    }

    if (tab === "Courses") {
      return courses
        .filter((course) => `${course.name} ${course.skills.join(" ")} ${course.provider}`.toLowerCase().includes(normalizedQuery))
        .map((course) => (
          <OpportunityCard
            key={course.name}
            title={course.name}
            subtitle={course.provider}
            details={[`Skills: ${course.skills.join(", ")}`]}
            sdg={course.sdg}
          />
        ));
    }

    return supportPrograms
      .filter((program) => `${program.name} ${program.eligibility.join(" ")}`.toLowerCase().includes(normalizedQuery))
      .map((program) => (
        <OpportunityCard
          key={program.name}
          title={program.name}
          subtitle="Scholarship or support program"
          details={[`Eligibility: ${program.eligibility.join(", ")}`]}
          sdg={program.sdg}
        />
      ));
  }, [normalizedQuery, tab]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Local Data"
        title="Opportunity dataset"
        copy="Sample jobs, courses, and support programs are bundled locally so the MVP remains reliable during a live demo."
      />

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setTab(item.name)}
              className={[
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-4 font-bold transition",
                tab === item.name ? "bg-bayanihan-green text-white" : "border border-bayanihan-border bg-white text-bayanihan-muted hover:text-bayanihan-green",
              ].join(" ")}
            >
              <item.icon size={18} aria-hidden="true" />
              {item.name}
            </button>
          ))}
        </div>

        <label className="relative block lg:w-80">
          <span className="sr-only">Search opportunities</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bayanihan-muted" size={18} aria-hidden="true" />
          <input
            className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white py-2 pl-10 pr-3 text-bayanihan-ink"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by skill, role, or provider"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {content.length > 0 ? (
          content
        ) : (
          <div className="rounded-lg border border-bayanihan-border bg-white p-6 text-bayanihan-muted shadow-soft">
            No matching opportunity found in the sample dataset.
          </div>
        )}
      </div>
    </section>
  );
}

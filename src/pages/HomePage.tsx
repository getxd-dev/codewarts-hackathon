import { ArrowRight, BriefcaseBusiness, FileText, GraduationCap, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";

export function HomePage() {
  return (
    <div>
      <section className="border-b border-bayanihan-border bg-gradient-to-br from-white via-bayanihan-mist to-bayanihan-gold/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <img src="/oportuniph-logo.png" alt="OportuniPH" className="mb-6 h-auto w-full max-w-lg" />
            <p className="mb-4 text-sm font-bold uppercase text-bayanihan-blue">AI talent marketplace for Filipino pathways</p>
            <h1 className="max-w-3xl text-4xl font-bold text-bayanihan-ink sm:text-5xl lg:text-6xl">
              Match Filipino talent to work-ready opportunities
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-bayanihan-muted">
              Choose your role first, then move into the right workspace for applicant screening or employer job-offer creation.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <RoleLink
                to="/assessment"
                icon={UserRound}
                title="I am an applicant"
                copy="Build a profile, analyze a resume, and see matched jobs, courses, and support."
                action="Go to Profile"
                tone="red"
              />
              <RoleLink
                to="/dashboard"
                icon={BriefcaseBusiness}
                title="I am an employer"
                copy="Create local job offers and publish them into the demo marketplace."
                action="Go to Employers"
                tone="blue"
              />
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-bayanihan-gold/50 bg-bayanihan-ink shadow-soft">
            <img
              className="h-full min-h-[360px] w-full object-cover opacity-95"
              src="/bayanihan-bridge-visual.png"
              alt="Opportunity pathway dashboard with learner documents and matched jobs"
            />
            <div className="absolute inset-x-0 bottom-0 grid h-2 grid-cols-3" aria-hidden="true">
              <span className="bg-bayanihan-green" />
              <span className="bg-bayanihan-gold" />
              <span className="bg-bayanihan-blue" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Profile + document screening" value="2 min" icon={FileText} tone="green" />
          <MetricCard label="Role and course matches" value="17" icon={GraduationCap} tone="blue" />
          <MetricCard label="Gemini-ready analysis flow" value="3.1" icon={Sparkles} tone="gold" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Computer Vision",
              copy: "Gemini 3.1 can read resume PDFs, text files, and images when an API key is configured.",
            },
            {
              title: "Artificial Intelligence",
              copy: "The app turns document signals and profile context into role matches, available courses, support programs, and next steps.",
            },
            {
              title: "Data Science",
              copy: "Transparent scoring explains readiness, skill gaps, job match percentage, and community-market demand signals.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-bayanihan-ink">{item.title}</h2>
              <p className="mt-3 leading-7 text-bayanihan-muted">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RoleLink({
  to,
  icon: Icon,
  title,
  copy,
  action,
  tone,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  copy: string;
  action: string;
  tone: "red" | "blue";
}) {
  const toneClasses =
    tone === "red"
      ? "border-bayanihan-green/30 bg-bayanihan-green/5 text-bayanihan-green hover:border-bayanihan-green hover:bg-bayanihan-green/10"
      : "border-bayanihan-blue/30 bg-bayanihan-blue/5 text-bayanihan-blue hover:border-bayanihan-blue hover:bg-bayanihan-blue/10";

  return (
    <Link
      to={to}
      className={[
        "group flex min-h-44 flex-col justify-between rounded-lg border p-5 transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bayanihan-blue/40",
        toneClasses,
      ].join(" ")}
    >
      <span className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white shadow-soft">
          <Icon size={23} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-xl font-bold text-bayanihan-ink">{title}</span>
          <span className="mt-2 block leading-7 text-bayanihan-muted">{copy}</span>
        </span>
      </span>
      <span className="mt-4 inline-flex items-center gap-2 font-bold">
        {action}
        <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

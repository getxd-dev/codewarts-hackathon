import { ArrowRight, BarChart3, FileText, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";

export function HomePage() {
  return (
    <div>
      <section className="border-b border-bayanihan-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="mb-4 text-sm font-bold uppercase text-bayanihan-green">AI talent marketplace for Filipino pathways</p>
            <h1 className="max-w-3xl text-4xl font-bold text-bayanihan-ink sm:text-5xl lg:text-6xl">
              Match Filipino talent to work-ready opportunities
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-bayanihan-muted">
              Upload a resume once. Get a readiness score, role matches, course links, and a concrete next-step path for the Philippine job market.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/assessment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-bayanihan-green px-5 py-3 font-bold text-white shadow-soft transition hover:bg-teal-800"
              >
                Start Profile
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-bayanihan-border bg-white px-5 py-3 font-bold text-bayanihan-ink transition hover:border-bayanihan-green hover:text-bayanihan-green"
              >
                View Analytics
                <BarChart3 size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-bayanihan-border bg-bayanihan-mist shadow-soft">
            <img
              className="h-full min-h-[360px] w-full object-cover"
              src="/bayanihan-bridge-visual.png"
              alt="Opportunity pathway dashboard with learner documents and matched jobs"
            />
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

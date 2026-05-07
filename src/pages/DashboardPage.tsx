import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Mail,
  MapPin,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { OpportunityCard } from "../components/OpportunityCard";
import { SectionHeader } from "../components/SectionHeader";
import { jobs } from "../lib/opportunityEngine";
import { loadAnalysis, loadEmployerJobOffers, saveEmployerJobOffers } from "../lib/storage";
import type { EducationLevel, EmployerJobOffer } from "../types";

const educationLevels: EducationLevel[] = [
  "Elementary Graduate",
  "High School Graduate",
  "Senior High School Graduate",
  "Vocational Graduate",
  "College Level",
  "College Graduate",
];

const initialForm = {
  companyName: "",
  title: "",
  location: "",
  workSetup: "Hybrid" as EmployerJobOffer["workSetup"],
  employmentType: "Full-time" as EmployerJobOffer["employmentType"],
  payRange: "",
  education: "Senior High School Graduate" as EducationLevel,
  skillsText: "",
  description: "",
  contact: "",
};

export function DashboardPage() {
  const [offers, setOffers] = useState<EmployerJobOffer[]>(() => loadEmployerJobOffers());
  const [form, setForm] = useState(initialForm);
  const currentAnalysis = loadAnalysis();

  const skillCoverage = useMemo(() => {
    const allSkills = offers.flatMap((offer) => offer.requiredSkills);
    return new Set(allSkills.map((skill) => skill.toLowerCase())).size;
  }, [offers]);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function createOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredSkills = form.skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 8);

    if (!form.companyName.trim() || !form.title.trim() || requiredSkills.length === 0) return;

    const offer: EmployerJobOffer = {
      id: makeId(),
      companyName: form.companyName.trim(),
      title: form.title.trim(),
      location: form.location.trim() || "Philippines",
      workSetup: form.workSetup,
      employmentType: form.employmentType,
      payRange: form.payRange.trim() || "To be discussed",
      education: form.education,
      requiredSkills,
      description: form.description.trim() || "Entry-level role for Filipino applicants building practical work experience.",
      contact: form.contact.trim() || "careers@example.com",
      createdAt: new Date().toISOString(),
    };

    const nextOffers = [offer, ...offers];
    setOffers(nextOffers);
    saveEmployerJobOffers(nextOffers);
    setForm(initialForm);
  }

  function deleteOffer(id: string) {
    const nextOffers = offers.filter((offer) => offer.id !== id);
    setOffers(nextOffers);
    saveEmployerJobOffers(nextOffers);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Employer Workspace"
        title="Employer dashboard"
        copy="Create Filipino-market job offers, publish them into the local demo marketplace, and align roles with candidate skill signals."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Employer job offers" value={offers.length} icon={BriefcaseBusiness} tone="green" />
        <MetricCard label="Sample roles available" value={jobs.length} icon={ClipboardCheck} tone="blue" />
        <MetricCard label="Skill signals requested" value={skillCoverage} icon={UsersRound} tone="gold" />
        <MetricCard
          label="Current candidate score"
          value={currentAnalysis ? `${currentAnalysis.score}` : "None"}
          icon={Building2}
          tone={currentAnalysis ? "green" : "red"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={createOffer} className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-bayanihan-green/10 text-bayanihan-green">
              <Plus size={24} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-bayanihan-ink">Create job offer</h2>
              <p className="text-sm text-bayanihan-muted">Local-only for the hackathon demo</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" name="companyName" value={form.companyName} onChange={updateField} placeholder="Halimbawa Labs" required />
            <Field label="Job title" name="title" value={form.title} onChange={updateField} placeholder="Junior Data Encoder" required />
            <Field label="Location" name="location" value={form.location} onChange={updateField} placeholder="Cavite / Remote" />
            <Field label="Pay range" name="payRange" value={form.payRange} onChange={updateField} placeholder="PHP 18k-28k/mo" />

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-bayanihan-ink">Work setup</span>
              <select name="workSetup" value={form.workSetup} onChange={updateField} className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3">
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-bayanihan-ink">Employment type</span>
              <select name="employmentType" value={form.employmentType} onChange={updateField} className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Project-based</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-bayanihan-ink">Minimum education</span>
              <select name="education" value={form.education} onChange={updateField} className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3">
                {educationLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>

            <Field
              label="Required skills"
              name="skillsText"
              value={form.skillsText}
              onChange={updateField}
              placeholder="Excel, Typing, Attention to detail"
              required
              className="sm:col-span-2"
            />

            <Field label="Contact" name="contact" value={form.contact} onChange={updateField} placeholder="careers@company.ph" className="sm:col-span-2" />

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-bayanihan-ink">Role description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                className="w-full resize-none rounded-md border border-bayanihan-border bg-white px-3 py-2 leading-7"
                placeholder="Describe the entry-level role, schedule, and support for applicants."
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-bayanihan-green px-5 font-bold text-white transition hover:bg-teal-800"
          >
            <Plus size={18} aria-hidden="true" />
            Publish Job Offer
          </button>
        </form>

        <section className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-bayanihan-blue/10 text-bayanihan-blue">
              <BriefcaseBusiness size={24} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-bayanihan-ink">Posted offers</h2>
              <p className="text-sm text-bayanihan-muted">These roles also appear in the Market page</p>
            </div>
          </div>

          {offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map((offer) => (
                <article key={offer.id} className="rounded-lg border border-bayanihan-border bg-bayanihan-mist p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-bayanihan-ink">{offer.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-bayanihan-green">{offer.companyName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteOffer(offer.id)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-bayanihan-border bg-white px-3 text-sm font-bold text-bayanihan-muted transition hover:border-red-200 hover:text-red-700"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-bayanihan-muted sm:grid-cols-2">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} aria-hidden="true" />
                      {offer.location} · {offer.workSetup}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail size={16} aria-hidden="true" />
                      {offer.contact}
                    </span>
                  </div>
                  <p className="mt-3 leading-7 text-bayanihan-muted">{offer.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offer.requiredSkills.map((skill) => (
                      <span key={skill} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-bayanihan-green">
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-bayanihan-border bg-bayanihan-mist p-6 text-bayanihan-muted">
              No employer offers yet. Create one to make the marketplace feel alive during the demo.
            </div>
          )}
        </section>
      </div>

      {offers.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-bayanihan-ink">Marketplace preview</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <OpportunityCard
                key={offer.id}
                title={offer.title}
                subtitle={`${offer.companyName} · ${offer.location}`}
                details={[
                  `Setup: ${offer.workSetup} · ${offer.employmentType}`,
                  `Required skills: ${offer.requiredSkills.join(", ")}`,
                  `Education: ${offer.education}`,
                  `Pay signal: ${offer.payRange}`,
                ]}
                actionLabel="Employer-posted"
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function Field({
  label,
  className = "",
  ...props
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <input className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3" {...props} />
    </label>
  );
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `offer-${Date.now()}`;
}

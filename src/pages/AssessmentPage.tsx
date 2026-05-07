import { ArrowRight, RotateCcw } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { demoProfile } from "../lib/demoProfile";
import { clearDemoState, saveProfile } from "../lib/storage";
import type { AccessLevel, EducationLevel, EmploymentStatus, SocialStatus, UserProfile } from "../types";

const educationOptions: EducationLevel[] = [
  "Elementary Graduate",
  "High School Graduate",
  "Senior High School Graduate",
  "Vocational Graduate",
  "College Level",
  "College Graduate",
];

const employmentOptions: EmploymentStatus[] = [
  "Student",
  "Out-of-school youth",
  "Unemployed",
  "Fresh graduate",
  "Part-time worker",
  "Employed but seeking better work",
];

const socialOptions: SocialStatus[] = [
  "Low income",
  "Solo parent household",
  "Rural or relocation area",
  "Person with disability",
  "Indigenous community",
  "No major barrier",
];

const accessOptions: AccessLevel[] = ["Reliable", "Shared", "Limited", "None"];

export function AssessmentPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(demoProfile);

  function updateField<K extends keyof UserProfile>(field: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProfile(profile);
    navigate("/upload");
  }

  function resetDemo() {
    clearDemoState();
    setProfile(demoProfile);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Assessment"
        title="Opportunity profile"
        copy="A short profile gives the recommendation engine enough context to score readiness and match local opportunities."
      />

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-bayanihan-border bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Name" value={profile.name} onChange={(value) => updateField("name", value)} required />
          <TextField
            label="Age"
            type="number"
            value={String(profile.age)}
            onChange={(value) => updateField("age", Number(value))}
            required
          />
          <TextField label="Location" value={profile.location} onChange={(value) => updateField("location", value)} required />
          <SelectField
            label="Education level"
            value={profile.educationLevel}
            options={educationOptions}
            onChange={(value) => updateField("educationLevel", value as EducationLevel)}
          />
          <SelectField
            label="Employment status"
            value={profile.employmentStatus}
            options={employmentOptions}
            onChange={(value) => updateField("employmentStatus", value as EmploymentStatus)}
          />
          <SelectField
            label="Income / social status"
            value={profile.socialStatus}
            options={socialOptions}
            onChange={(value) => updateField("socialStatus", value as SocialStatus)}
          />
          <SelectField
            label="Internet access"
            value={profile.internetAccess}
            options={accessOptions}
            onChange={(value) => updateField("internetAccess", value as AccessLevel)}
          />
          <SelectField
            label="Device access"
            value={profile.deviceAccess}
            options={accessOptions}
            onChange={(value) => updateField("deviceAccess", value as AccessLevel)}
          />
          <TextArea
            label="Current skills"
            value={profile.currentSkills}
            onChange={(value) => updateField("currentSkills", value)}
          />
          <TextArea
            label="Career interest"
            value={profile.careerInterest}
            onChange={(value) => updateField("careerInterest", value)}
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-bayanihan-border bg-white px-4 font-bold text-bayanihan-muted transition hover:border-bayanihan-green hover:text-bayanihan-green"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Reset Demo
          </button>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-bayanihan-green px-5 font-bold text-white transition hover:bg-teal-800"
          >
            Continue to Upload
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <input
        className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3 text-bayanihan-ink"
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <select
        className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3 text-bayanihan-ink"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-md border border-bayanihan-border bg-white px-3 py-3 text-bayanihan-ink"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

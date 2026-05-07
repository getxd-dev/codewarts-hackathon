# OportuniPH MVP Spec

## Product Intent

OportuniPH is an AI-powered opportunity navigator for marginalized Filipino students, out-of-school youth, fresh graduates, and low-income job seekers. The MVP helps a user move from profile and uploaded or generated resume to a clear opportunity score, matched jobs, available courses, support programs, missing skills, and a personalized next-step pathway.

## Problem

Opportunity inequality in the Philippines is widened by uneven access to education, devices, internet, job-readiness support, and reliable information about scholarships or entry-level work. Many users have a resume but need help translating it into practical next steps.

## SDG Alignment

- SDG 4: Quality Education through course, training, and scholarship recommendations.
- SDG 8: Decent Work and Economic Growth through entry-level job matching and work-readiness steps.
- SDG 10: Reduced Inequalities through barrier-aware scoring and support prioritization.
- SDG 11: Sustainable Cities and Communities through location and community access insights.

## Required Fields

- Computer Vision: resume upload, camera photo capture with face-alignment guide, and Gemini resume analysis with honest text-file fallback.
- Artificial Intelligence: personalized opportunity recommendations using Gemini when configured and deterministic local matching as fallback.
- Data Science: opportunity scoring, skill gap percentage, job match percentage, and market-fit signals.

## Core User Flow

1. User opens the landing page.
2. User chooses Applicant or Employer.
3. Applicant users are routed to Profile and complete a short profile.
4. Applicant users upload a resume PDF/image/text file or generate a resume from the saved profile.
5. For generated resumes, the user opens the camera, uses readiness checks for face framing, lighting, sharpness, and stability, captures a photo, and applies a preset.
6. The app extracts or creates readable resume text.
7. The app combines profile and resume text.
8. The app calculates an Opportunity Score from 0 to 100.
9. The app recommends jobs, courses, scholarships/support, missing skills, and next steps.
10. Employer users are routed to Employers and can create local job offers that appear in the marketplace.

## MVP Pages

- Home / Landing Page
- Role Choice
- Assessment Form
- Document Upload / Analysis Page
- Results Page
- Opportunities Page
- Employer Dashboard Page

## Scoring Requirements

Opportunity Score is calculated from:

- Education readiness
- Skills readiness
- Internet/device access
- Employment status
- Income/social barriers
- Resume/document availability

Classification:

- 0-40: High support needed
- 41-70: Moderate support needed
- 71-100: Opportunity-ready

## Recommendation Requirements

Results must include:

- Top 3 jobs
- Top 3 available courses or training programs
- Top 3 scholarships or support programs
- Missing skills
- Personalized next-step pathway
- Market-fit insights

## Employer Dashboard Requirements

Employer dashboard must support:

- Create a job offer with company, title, location, setup, pay, education, skills, description, and contact.
- Persist created offers in localStorage for demo continuity.
- Show created offers in the dashboard.
- Surface created offers in the Market page Jobs tab.

## Non-Goals

- No full job portal.
- No live job scraping.
- No production login/auth.
- No production government system.
- No paid API dependency.
- No complex backend.

## Acceptance Criteria

- App runs locally with `npm run dev`.
- Home lets users choose Applicant or Employer, routing applicants to Profile and employers to Employers.
- User can complete assessment, upload a resume, run Gemini or text-file analysis, and see results.
- User can generate a resume from profile inputs and a captured applicant photo after camera-readiness checks pass.
- App works without external API keys.
- Local JSON data powers opportunities.
- Score, recommendation, and dashboard logic are deterministic and testable.
- README includes overview, SDG alignment, stack, run steps, demo flow, limitations, and next phase.
- Pitch script includes hook, challenge, solution, demo, impact, and vision.

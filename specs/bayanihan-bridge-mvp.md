# Bayanihan Bridge PH MVP Spec

## Product Intent

Bayanihan Bridge PH is an AI-powered opportunity navigator for marginalized Filipino students, out-of-school youth, fresh graduates, and low-income job seekers. The MVP helps a user move from profile and resume upload to a clear opportunity score, matched jobs, available courses, support programs, missing skills, and a personalized next-step pathway.

## Problem

Opportunity inequality in the Philippines is widened by uneven access to education, devices, internet, job-readiness support, and reliable information about scholarships or entry-level work. Many users have a resume but need help translating it into practical next steps.

## SDG Alignment

- SDG 4: Quality Education through course, training, and scholarship recommendations.
- SDG 8: Decent Work and Economic Growth through entry-level job matching and work-readiness steps.
- SDG 10: Reduced Inequalities through barrier-aware scoring and support prioritization.
- SDG 11: Sustainable Cities and Communities through location and community access insights.

## Required Fields

- Computer Vision: resume upload and Gemini resume analysis with honest text-file fallback.
- Artificial Intelligence: personalized opportunity recommendations using Gemini when configured and deterministic local matching as fallback.
- Data Science: opportunity scoring, skill gap percentage, job match percentage, and dashboard metrics.

## Core User Flow

1. User opens the landing page.
2. User starts the assessment.
3. User completes a short profile.
4. User uploads a resume PDF, image, or text file.
5. The app extracts readable resume text.
6. The app combines profile and resume text.
7. The app calculates an Opportunity Score from 0 to 100.
8. The app recommends jobs, courses, scholarships/support, missing skills, and next steps.
9. The app shows a talent-market readiness dashboard.

## MVP Pages

- Home / Landing Page
- Assessment Form
- Document Upload / Analysis Page
- Results Page
- Opportunities Page
- Dashboard Page

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

## Dashboard Requirements

Dashboard must show:

- Total users assessed
- Most common skill gaps
- Total role matches
- Total course matches
- High-support users
- Community/location insights
- Users by opportunity-readiness level

## Non-Goals

- No full job portal.
- No live job scraping.
- No production login/auth.
- No production government system.
- No paid API dependency.
- No complex backend.

## Acceptance Criteria

- App runs locally with `npm run dev`.
- User can complete assessment, upload a resume, run Gemini or text-file analysis, and see results.
- App works without external API keys.
- Local JSON data powers opportunities.
- Score, recommendation, and dashboard logic are deterministic and testable.
- README includes overview, SDG alignment, stack, run steps, demo flow, limitations, and next phase.
- Pitch script includes hook, challenge, solution, demo, impact, and vision.

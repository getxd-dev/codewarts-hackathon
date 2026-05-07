# PLAN_MVP

## Goal

Build the first hackathon MVP of OportuniPH as a local React/Tailwind app with software-factory artifacts, deterministic scoring, Gemini-ready resume analysis, profile-based resume generation with camera capture, Gemini recommendation enrichment, local datasets, employer job-offer creation, README, and pitch script.

## Architecture

- Use Vite + React + TypeScript for fast local development.
- Use Tailwind CSS for responsive UI.
- Use `react-router-dom` for MVP page routing.
- Use local JSON files for jobs, courses, scholarships/support programs, and mock assessed users.
- Use Gemini 3.1 Pro Preview through a local dev proxy when `GEMINI_API_KEY` is configured.
- Use deterministic TypeScript functions for text fallback, generated resumes, scoring, recommendations, and local employer offers.

## File-Level Plan

- `AGENTS.md`: repository operating contract.
- `DESIGN.md`: product design guide.
- `specs/bayanihan-bridge-mvp.md`: product behavior and acceptance criteria.
- `docs/ARCHITECTURE.md`: current implementation reference.
- `src/data/*.json`: local jobs, courses, support, and mock users.
- `src/lib/ocr.ts`: file upload Gemini resume analysis and local text extraction.
- `src/lib/geminiRecommendations.ts`: optional Gemini enrichment for top jobs, available courses, and support programs.
- `src/lib/opportunityEngine.ts`: score, job matching, and local recommendations.
- `src/lib/storage.ts`: localStorage helpers for demo continuity.
- `src/components/*`: reusable UI cards, layout, resume generator, badges, and score ring.
- `src/pages/*`: Home, Assessment, Upload, Results, Opportunities, Dashboard.
- `README.md`: overview, run steps, demo flow, limitations, next phase.
- `pitch/PITCH_SCRIPT.md`: short recorded-demo pitch.
- `scripts/validate-factory.mjs`: lightweight factory artifact check.

## Data Science Plan

- Normalize user skills and extracted document text.
- Match detected skills against required job skills.
- Score readiness across education, skills, access, employment, social barriers, and document availability.
- Calculate skill gap percentage and best job match percentage.
- Classify users into support/readiness levels.
- Keep scoring outputs transparent enough to explain during the employer and candidate demo flow.

## Document Analysis Plan

- Accept uploaded resume image, PDF, or text file.
- Offer a generated-resume path using profile inputs, preset resume copy, and captured applicant photo.
- Use browser face detection when available to confirm the applicant face is aligned inside the camera guide.
- Send uploads to Gemini 3.1 Pro Preview through `/api/gemini/analyze-document` when configured.
- If no Gemini key is configured, read text files directly and do not fabricate binary document content.
- Surface confidence, model name, extracted text, and detected signals so judges can see the CV/AI step during the demo.

## Artificial Intelligence Plan

- Use Gemini recommendations when configured and deterministic local rules as fallback:
  - Rank jobs by skill and education match.
  - Rank courses by missing skills.
  - Rank support programs by social status, education, and employment context.
  - Generate next steps from gaps and top matches.
- Require Gemini to rank only local JSON opportunities and reuse existing source URLs.

## Validation

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

## Scope Guardrails

- Do not add auth.
- Do not scrape live job sites.
- Do not add a backend unless a later phase requires it.
- Keep the UI polished but small enough to explain in a 3-5 minute demo.

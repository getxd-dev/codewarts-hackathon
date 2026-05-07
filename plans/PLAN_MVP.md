# PLAN_MVP

## Goal

Build the first hackathon MVP of Bayanihan Bridge PH as a local React/Tailwind app with software-factory artifacts, deterministic scoring, mock OCR, mock AI recommendations, local datasets, dashboard charts, README, and pitch script.

## Architecture

- Use Vite + React + TypeScript for fast local development.
- Use Tailwind CSS for responsive UI.
- Use `react-router-dom` for MVP page routing.
- Use local JSON files for jobs, courses, scholarships/support programs, and mock dashboard users.
- Use deterministic TypeScript functions for OCR fallback, scoring, and recommendations.
- Use Recharts for dashboard charts.

## File-Level Plan

- `AGENTS.md`: repository operating contract.
- `DESIGN.md`: product design guide.
- `specs/bayanihan-bridge-mvp.md`: product behavior and acceptance criteria.
- `docs/ARCHITECTURE.md`: current implementation reference.
- `src/data/*.json`: local jobs, courses, support, and mock users.
- `src/lib/ocr.ts`: file upload OCR/mock OCR extraction.
- `src/lib/opportunityEngine.ts`: score, job matching, recommendations, dashboard metrics.
- `src/lib/storage.ts`: localStorage helpers for demo continuity.
- `src/components/*`: reusable UI cards, layout, badges, score ring, charts.
- `src/pages/*`: Home, Assessment, Upload, Results, Opportunities, Dashboard.
- `README.md`: overview, run steps, demo flow, limitations, next phase.
- `pitch/PITCH_SCRIPT.md`: short recorded-demo pitch.
- `scripts/validate-factory.mjs`: lightweight factory artifact check.

## Data Science Plan

- Normalize user skills and extracted OCR text.
- Match detected skills against required job skills.
- Score readiness across education, skills, access, employment, social barriers, and document availability.
- Calculate skill gap percentage and best job match percentage.
- Classify users into support/readiness levels.
- Aggregate mock and current-user data for SDG dashboard charts.

## Computer Vision Plan

- Accept uploaded resume, certificate, school record, handwritten form, image, PDF, or text file.
- If a text file is uploaded, read its text directly.
- For images/PDFs and other file types, use a deterministic mock OCR function based on document type, filename, and profile context.
- Surface confidence and extracted highlights so judges can see the CV step during the demo.

## Artificial Intelligence Plan

- Use a mock AI recommendation function with transparent rules:
  - Rank jobs by skill and education match.
  - Rank courses by missing skills.
  - Rank support programs by social status, education, and employment context.
  - Generate next steps from gaps and top matches.
- Keep a future API integration path documented, but do not require an API key.

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

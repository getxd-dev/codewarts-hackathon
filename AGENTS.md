# AGENTS.md

This is the operating contract for humans and AI agents working on Bayanihan Bridge PH.

## Core Rules

- Research before planning. Inspect the repo and relevant docs before meaningful changes.
- Plan before non-trivial code changes. Keep active implementation strategy in `plans/`.
- Preserve user work. Do not revert unrelated changes.
- Keep the MVP simple, demo-ready, and hackathon-scoped.
- Prefer deterministic local behavior over hidden services. The app must work without paid APIs.
- Put product behavior in `specs/`, current architecture in `docs/`, and implementation plans in `plans/`.
- Validate before finalizing with the strongest practical checks available.
- Do not add auth, scraping, production databases, or government-system complexity unless explicitly requested.

## Artifact Boundaries

- `specs/`: product intent, user flows, constraints, acceptance criteria.
- `plans/`: implementation strategy, file-level tasks, validation plan.
- `docs/`: current architecture, demo operations, and technical notes.
- `src/`: React implementation, local AI/CV/Data Science logic, and UI.
- `src/data/`: local fallback opportunity datasets.

## MVP Engineering Standards

- Use React, TypeScript, Tailwind CSS, local JSON data, and deterministic functions.
- Keep scoring rules transparent and easy to explain during a live pitch.
- Use Gemini document analysis when `GEMINI_API_KEY` is configured; keep text-file fallback honest and non-fabricated.
- Keep recommendation logic understandable: profile + document text + local opportunity data.
- Make the UI mobile-responsive for students, barangay users, and demo judges.
- Use accessible labels, clear validation states, and readable contrast.

## Required Local Checks

Run these before handoff when dependencies are installed:

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

## Review Checklist

- The full assessment flow works from landing page to results.
- File upload produces Gemini analysis when configured or direct text extraction for text files.
- Opportunity Score stays in the 0-100 range with a visible classification.
- Results show jobs, available courses, support programs, skill gaps, next steps, and market fit.
- Dashboard charts render from local data.
- README and pitch script explain the demo clearly.

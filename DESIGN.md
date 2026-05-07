# DESIGN.md

Design guide for Bayanihan Bridge PH.

## Product Feeling

Bayanihan Bridge PH should feel hopeful, trustworthy, local, and practical. It is not a full job portal or government dashboard. It is a guided opportunity navigator for students, out-of-school youth, fresh graduates, and low-income job seekers who need a clear next step.

## Visual Direction

- Use clean Filipino social-impact branding with civic warmth.
- Favor calm greens, deep ink, clear sky blue, warm sun yellow, and restrained red accents.
- Avoid a one-note palette. Use color to separate education, work, inclusion, and community signals.
- Use cards, progress bars, badges, and charts for scanability.
- Keep cards at `8px` radius or less.
- Keep pages mobile-first and readable on barangay office laptops, student phones, and projector screens.

## Color Tokens

- Bayanihan green: `#0f766e`
- River blue: `#2563eb`
- Sun gold: `#f59e0b`
- Bayan red: `#dc2626`
- Leaf green: `#16a34a`
- Ink: `#102026`
- Muted text: `#52646c`
- App background: `#f6faf8`
- Surface: `#ffffff`
- Border: `#d9e7e1`

## Typography

- Use the system font stack for local reliability.
- Use clear hierarchy: short page titles, practical section headings, compact labels.
- Do not scale type with viewport width.
- Keep letter spacing at `0`.
- Prefer plain, direct English that is understandable to Filipino students and community users.

## Components

- Buttons use icons from `lucide-react` when the action has a familiar symbol.
- Form fields use visible labels and short helper text only when needed for clarity.
- Keep public-facing UI focused on talent screening, role matching, course paths, and support referrals.
- Progress bars and score rings should make results easy to understand at a glance.
- Charts should support the pitch, not overwhelm it.

## Page Guidance

- Home: show the product name, social-impact promise, and a strong assessment entry point in the first viewport.
- Assessment: keep the form short and forgiving.
- Upload: make the Gemini or text-extraction analysis state obvious and confidence-based.
- Results: make the score, top matches, missing skills, and next steps visually memorable.
- Opportunities: show local datasets without pretending to be a full marketplace.
- Dashboard: show readiness, skill gaps, matching volume, and location insight for hackathon judges.

## Non-Goals

- No complex login/auth.
- No live job scraping.
- No production government integrations.
- No overbuilt backend.
- No dark, heavy, or corporate-only visual tone.

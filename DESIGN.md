# DESIGN.md

Design guide for OportuniPH.

## Product Feeling

OportuniPH should feel hopeful, trustworthy, local, and practical. It is not a full job portal or government dashboard. It is a guided opportunity navigator for students, out-of-school youth, fresh graduates, and low-income job seekers who need a clear next step.

## Visual Direction

- Use clean Filipino social-impact branding with civic warmth.
- Favor calm greens, deep ink, clear sky blue, warm sun yellow, and restrained red accents.
- Avoid a one-note palette. Use color to separate education, work, inclusion, and community signals.
- Use cards, progress bars, badges, camera guides, and compact previews for scanability.
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
- Camera capture should feel guided and confidence-building, with a clear face-alignment shape and plain status text.

## Page Guidance

- Home: show the product name, social-impact promise, and a strong assessment entry point in the first viewport.
- Assessment: keep the form short and forgiving.
- Analyze: let users either upload a resume or generate one from profile inputs and a camera photo; make analysis state obvious and confidence-based.
- Results: make the score, top matches, missing skills, and next steps visually memorable.
- Opportunities: show local datasets without pretending to be a full marketplace.
- Employers: keep job-offer creation fast, local, and obviously demo-safe.

## Non-Goals

- No complex login/auth.
- No live job scraping.
- No production government integrations.
- No overbuilt backend.
- No dark, heavy, or corporate-only visual tone.

# DESIGN.md

Design guide for OportuniPH.

## Product Feeling

OportuniPH should feel hopeful, trustworthy, local, and practical. It is not a full job portal or government dashboard. It is a guided opportunity navigator for students, out-of-school youth, fresh graduates, and low-income job seekers who need a clear next step.

## Visual Direction

- Use clean Filipino social-impact branding with civic warmth.
- Use the provided OportuniPH logo as the primary brand signal in the header and first viewport.
- Favor the logo palette: strong red, royal blue, salakot yellow, silver gray, and near-black.
- Avoid a one-note palette. Use color to separate education, work, inclusion, and community signals.
- Use cards, progress bars, badges, camera guides, and compact previews for scanability.
- Keep cards at `8px` radius or less.
- Keep pages mobile-first and readable on barangay office laptops, student phones, and projector screens.

## Color Tokens

- Primary logo red: `#e50909`
- Royal logo blue: `#1f63d8`
- Salakot yellow: `#f6b23c`
- Deep crimson: `#c40018`
- Purple accent: `#8d1b8f`
- Ink: `#111111`
- Muted text: `#646464`
- App background: `#fff7ef`
- Surface: `#ffffff`
- Border: `#ead8c4`

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
- Home role choice should use red for applicants and blue for employers, with yellow used as a warm highlight.
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

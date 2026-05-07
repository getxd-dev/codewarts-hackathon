# OportuniPH

OportuniPH is an AI-powered opportunity navigator for marginalized Filipino students, out-of-school youth, fresh graduates, and low-income job seekers.

The MVP turns a short profile plus an uploaded or generated resume into an Opportunity Score, matched jobs, available courses, scholarships/support programs, skill gaps, and a personalized pathway.

## SDG Alignment

- SDG 4: Quality Education through available courses, training, and education support recommendations.
- SDG 8: Decent Work and Economic Growth through entry-level job matching.
- SDG 10: Reduced Inequalities through barrier-aware support and inclusive scoring.
- SDG 11: Sustainable Cities and Communities through location and access insights.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Local JSON sample data
- Gemini 3.1 Pro Preview resume analysis and recommendation enrichment when `GEMINI_API_KEY` is configured
- Camera-based resume generation with a face-alignment guide and readiness checklist
- Honest local text-file fallback
- Deterministic local recommendation fallback
- Deterministic Data Science scoring

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Gemini Setup

Create `.env.local` from `.env.example`:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.1-pro-preview
```

Restart `npm run dev` after setting the key. The local Vite proxy keeps the key out of browser code during development.

## Validation

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

## Demo Flow

1. Open the Home page.
2. Choose Applicant to go to Profile, or choose Employer to go directly to Employers.
3. As an applicant, fill in a user profile for a student, fresh graduate, out-of-school youth, or job seeker.
4. Upload a resume PDF/image/text file or choose Generate Resume.
5. In Generate Resume, open the camera, wait for the readiness checklist to pass, capture a photo, and use the profile-based resume preset.
6. Analyze the resume. With `GEMINI_API_KEY`, PDFs/images/text are processed by Gemini 3.1 Pro Preview and the top jobs, available courses, and support matches are enriched with Gemini reasoning. Without a key, text files and generated resumes still work locally.
7. Generate the pathway.
8. Show the Results page:
   - Opportunity Score
   - readiness classification
   - top 3 jobs
   - top 3 available courses with outbound links
   - top support programs
   - missing skills
   - next 3 steps
   - market-fit insights
9. Open Market to show local JSON fallback data and course links.
10. Open Employers to create a job offer and show the two-sided marketplace flow.

## Limitations

- Accurate PDF/image analysis requires a Gemini API key.
- Live face readiness uses the browser `FaceDetector` API when available; unsupported browsers fall back to local lighting, sharpness, centering, and stability checks.
- AI recommendations use Gemini when configured and fall back to deterministic local matching.
- Opportunity datasets are sample data only.
- No authentication, backend, scraping, or production government integration is included.

## Next Phase

- Move the Gemini proxy into a secure production backend.
- Expand Gemini-backed recommendations with safer source validation and richer local-market datasets.
- Add verified opportunity feeds from schools, LGUs, NGOs, TESDA-style programs, and employers.
- Add Filipino and regional language support.
- Add admin upload tools for community opportunity datasets.

# PLAN_CANVA_RESUME_TEMPLATE

## Goal

Improve the generated resume preset so the applicant photo and profile inputs render as a polished, Canva-style visual resume preview instead of a plain text block.

## File-Level Plan

- `src/components/ResumeGenerator.tsx`: replace the plain resume preview with a branded visual resume card using the OportuniPH logo palette, applicant photo, contact chips, skill pills, and structured sections.
- Keep `buildResumeText` as the text payload used by the analysis and matching flow.
- Add a compact "AI text version" panel under the designed preview so judges can still inspect the extracted/generated text.
- Compact the generated-resume UI so the preview, camera, and inputs fit better on laptop screens without browser zooming.
- Give Generate Resume a wider page container than the standard upload flow, while keeping the visual resume card constrained so it does not stretch.
- Keep the embedded resume preview fixed-size and clipped, with a full preview modal for long generated content.

## Validation

Attempt:

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

If local Node/npm remains blocked, report that clearly.

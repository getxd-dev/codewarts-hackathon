# PLAN_ROLE_CAMERA_UPDATE

## Goal

Make the MVP entry flow ask users whether they are an applicant or employer, then route applicants to the profile page and employers to the Employers dashboard. Improve generated-resume camera capture by replacing the fragile green/white oval signal with clearer readiness checks.

## File-Level Plan

- `src/pages/HomePage.tsx`: convert the main call to action into an explicit applicant/employer role chooser.
- `src/components/ResumeGenerator.tsx`: keep browser `FaceDetector` as the strongest signal when available, add deterministic local frame checks for lighting, sharpness, centering, and stability, and show those checks instead of relying on the oval border color.
- `specs/bayanihan-bridge-mvp.md`: document role choice and more honest camera-readiness behavior.
- `docs/ARCHITECTURE.md`: update the Home/data-flow and generated-resume strategy.
- `README.md` and `pitch/PITCH_SCRIPT.md`: refresh the demo flow language.

## Camera Strategy

- Native face detection path: pass only when exactly one face is detected, the face is centered, and the frame quality is acceptable.
- Local fallback path: avoid skin-tone detection; use luminance, edge detail, center mass, and steady frame checks so the app is less biased and less jumpy.
- UI path: show a readiness label, a progress meter, and checklist rows for lighting, center, sharpness, and stability. Keep the oval as a framing guide, but do not make its color the source of truth.

## Validation

Run the strongest practical local checks:

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

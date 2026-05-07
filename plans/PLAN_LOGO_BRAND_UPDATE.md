# PLAN_LOGO_BRAND_UPDATE

## Goal

Use the provided OportuniPH logo across the website and shift the visual palette toward the logo colors: red, blue, yellow, gray, black, and soft warm backgrounds.

## File-Level Plan

- `public/oportuniph-logo.png`: copy the provided logo into the app public assets.
- `tailwind.config.ts`: remap existing `bayanihan-*` color tokens to the logo palette while keeping class names stable.
- `src/styles.css`: update global background, focus, and score-ring accents to fit the new brand.
- `src/components/AppLayout.tsx`: replace the placeholder icon lockup with the real logo and use a branded header/footer treatment.
- `src/pages/HomePage.tsx`: feature the logo in the first viewport and adjust role cards so red, blue, and yellow all show up intentionally.
- `DESIGN.md`: document the new logo-led color direction.

## Validation

Run the required local checks if the Node/npm toolchain is available:

```bash
npm run lint
npm test
npm run build
npm run validate:factory
```

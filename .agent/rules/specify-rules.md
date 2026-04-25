# booking-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-25

## Active Technologies
- TypeScript 5.x / React 18.x + `i18next`, `react-i18next`, `i18next-browser-languagedetector` (002-multi-language-support)
- `localStorage` (for language preference) (002-multi-language-support)
- TypeScript / React + Tailwind CSS, Shadcn UI, framer-motion (for the theme transition), next-themes (or equivalent existing theme provider) (003-premium-barbershop-theme)
- N/A (UI only) (003-premium-barbershop-theme)
- TypeScript / React + `next-themes`, `radix-ui` (Dropdown), `lucide-react` (004-theme-toggle)
- `localStorage` (handled by `next-themes`) (004-theme-toggle)

- TypeScript / React (Vite) + @tanstack/react-query, react-router-dom, lucide-react, date-fns, shadcn/ui (001-booking-filters-actions)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript / React (Vite): Follow standard conventions

## Recent Changes
- 004-theme-toggle: Added TypeScript / React + `next-themes`, `radix-ui` (Dropdown), `lucide-react`
- 003-premium-barbershop-theme: Added TypeScript / React + Tailwind CSS, Shadcn UI, framer-motion (for the theme transition), next-themes (or equivalent existing theme provider)
- 002-multi-language-support: Added TypeScript 5.x / React 18.x + `i18next`, `react-i18next`, `i18next-browser-languagedetector`


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

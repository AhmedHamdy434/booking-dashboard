<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - II. Deterministic Scheduling Logic (Added 15-min slot requirement)
  - III. Multi-Layer Validation Architecture (Clarified Supabase trigger requirement)
  - V. Feature-Based Component Architecture (Renamed to "Feature-First Architecture")
  - [NEW] VI. Hook-Based Data Abstraction
  - [NEW] VII. Standardized UI Semantics
- Added sections: Development Guidelines (Coding standards, State management, Styling)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Principles updated)
  - ✅ .specify/templates/tasks-template.md (Phase structure verified)
- Follow-up TODOs: None
-->

# Booking Dashboard Constitution

## Core Principles

### I. Premium Aesthetics & UX (NON-NEGOTIABLE)
The dashboard must provide a high-end SaaS experience. Every UI element should feel premium, using a dark-mode first design, glassmorphism effects, smooth micro-animations, and vibrant, tailored color palettes. Generic designs are unacceptable; visual excellence is a primary requirement.

### II. Deterministic Scheduling Logic
Scheduling MUST be based on strict **15-minute intervals**. Every booking validation must calculate the service duration and ensure the slot is fully clear ("ends before next starts"). Time generation logic must be consistent across the mobile app and admin dashboard.

### III. Multi-Layer Validation Architecture
Business rules, especially those concerning scheduling conflicts, must be enforced at both the application level (React Query/Hooks) and the persistence level (**Supabase Triggers**). Code must never assume frontend validation is sufficient.

### IV. Admin-Mediated Booking Lifecycle
All customer bookings initiate in a 'pending' state. The dashboard must clearly distinguish between `pending`, `confirmed`, `completed`, and `cancelled` statuses. Admin approval is the only gateway to a confirmed status.

### V. Feature-First Architecture
The codebase is organized into independent feature modules (e.g., `src/features/bookings`). Each feature folder must contain its own `api/`, `components/`, and `hooks/` directories. Cross-feature imports should be minimal and explicit.

### VI. Hook-Based Data Abstraction
Components MUST NOT call Supabase or external APIs directly. All data fetching and mutations must be encapsulated in **React Query hooks** located in the feature's `hooks/` directory.

### VII. Standardized UI Semantics
UI consistency is maintained through standardized status colors:
- **Pending**: Amber (🟡)
- **Confirmed**: Emerald (🟢)
- **Completed**: Sky/Blue (🔵)
- **Cancelled**: Rose/Red (🔴)
All components must derive from the `@/components/ui` (Shadcn) library.

## Development Guidelines

### Coding Standards
- **Language**: TypeScript with strict null checks.
- **Imports**: Use absolute paths with the `@/` alias.
- **Date Logic**: Always use `date-fns` for calculations and formatting.
- **Icons**: Use `lucide-react` for all dashboard iconography.

### State Management
- **Server State**: Managed exclusively via `@tanstack/react-query`.
- **UI State**: Use `useState` or `useReducer` for local component state.
- **Global UI State**: Use `Zustand` if cross-component communication is required (avoiding Context API for performance).

### Styling & Layout
- **Tailwind CSS**: Use utility classes for all styling.
- **Animations**: Use `framer-motion` for complex transitions and `animate-pulse` for loading/pending states.
- **Responsive**: All layouts must be mobile-friendly, using grid/flexbox patterns that stack on smaller screens.

## Governance

This Constitution is the source of truth for all technical decisions. Versioning follows SemVer rules. Amendments must be justified by business needs or significant architectural improvements.

**Version**: 1.1.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25

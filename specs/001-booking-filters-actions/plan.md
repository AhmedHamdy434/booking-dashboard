# Implementation Plan: Booking Filters and Admin Actions

**Branch**: `001-booking-filters-actions` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-booking-filters-actions/spec.md`

## Summary

This feature implements a robust management interface for bookings. It introduces "Accept" and "Reject" administrative actions for pending bookings and an advanced filtering system (Status, Date Range, Barber) that is fully synchronized with the URL via `searchParams`. The data fetching layer will be updated to handle these filters natively using TanStack Query.

## Technical Context

**Language/Version**: TypeScript / React (Vite)  
**Primary Dependencies**: @tanstack/react-query, react-router-dom, lucide-react, date-fns, shadcn/ui  
**Storage**: Supabase (PostgreSQL)  
**Testing**: [NEEDS CLARIFICATION: No testing framework established in constitution yet. Assuming manual validation for now.]  
**Target Platform**: Web (Admin Dashboard)  
**Project Type**: Web Application  
**Performance Goals**: Filter updates < 500ms, Action feedback < 2s  
**Constraints**: Dark-mode first, glassmorphism aesthetics, mobile-responsive grid layout

## Constitution Check

| Principle | Status | Implementation Detail |
|-----------|--------|-----------------------|
| I. Premium Aesthetics | ✅ | Using Shadcn/UI with glassmorphism and custom color tokens. |
| IV. Admin-Mediated Lifecycle | ✅ | Implementing explicit Accept/Reject actions for 'pending' state. |
| V. Feature-First Architecture | ✅ | Locating logic within `src/features/bookings/`. |
| VI. Hook-Based Data | ✅ | Encapsulating filtering and actions in `useBookings` and `useUpdateBookingStatus`. |
| VII. Standardized UI Semantics| ✅ | Using Amber/Emerald/Rose/Sky colors for booking statuses. |

## Project Structure

### Documentation (this feature)

```text
specs/001-booking-filters-actions/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── contracts/           
    └── bookings-api.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ui/              # Shadcn components (Calendar, Popover, Select)
└── features/
    └── bookings/
        ├── api/
        │   └── bookingsApi.ts  # Updated with filter support
        ├── components/
        │   ├── BookingFilters.tsx # NEW component
        │   └── BookingsList.tsx    # Updated with action buttons
        ├── hooks/
        │   └── useBookings.ts      # Updated with searchParams sync
        └── BookingsPage.tsx        # Main view integration
```

**Structure Decision**: Single project structure with feature-based modules as per Principle V.

## Phase 0: Outline & Research

### 0.1 URL SearchParams Sync with React Query
- **Decision**: Use `useSearchParams` hook to manage the filter state.
- **Logic**: The `queryKey` for `useBookings` will include the search parameters: `['bookings', { status, from, to, barberId }]`. This ensures automatic re-fetching when filters change.

### 0.2 Date Range Filtering with Supabase
- **Decision**: Use Supabase `.gte()` and `.lte()` filters.
- **Formatting**: Dates from `searchParams` must be validated and formatted via `date-fns` to ISO strings before reaching the API.

## Phase 1: Design & Contracts

### data-model.md
Refines the `Booking` entity to include the `status` field and describes the relationship with `Barber`.

### contracts/bookings-api.md
Defines the `getBookings` function signature to accept a `Filters` object:
```ts
interface BookingFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  barberId?: string;
}
```

### quickstart.md
Instructions for verifying the filters:
1. Navigate to `/bookings`.
2. Change filters and observe URL changes.
3. Refresh page and verify filters are retained.

# Tasks: Booking Filters and Admin Actions

**Input**: Design documents from `specs/001-booking-filters-actions/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify project structure and dependencies (@tanstack/react-query, react-router-dom, date-fns)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Update `Booking` type in `src/types/booking.ts` to include `status` field
- [ ] T003 Update `bookingsApi.ts` to support filtering in `getBookings` and add `updateStatus` method in `src/features/bookings/api/bookingsApi.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Admin Decision on Bookings (Priority: P1) 🎯 MVP

**Goal**: Allow admins to Accept or Reject pending bookings directly from the list.

**Independent Test**: Navigate to Bookings page, find a pending booking, click "Accept", and verify status updates to "Confirmed".

### Implementation for User Story 1

- [ ] T004 [P] [US1] Implement `useUpdateBookingStatus` mutation hook in `src/features/bookings/hooks/useBookings.ts`
- [ ] T005 [US1] Add Accept/Reject buttons and status badges to `BookingsList.tsx` in `src/features/bookings/components/BookingsList.tsx`

**Checkpoint**: User Story 1 complete and testable.

---

## Phase 4: User Story 2 - Advanced Booking Filtering (Priority: P2)

**Goal**: Implement comprehensive filtering by status, date range, and barber.

**Independent Test**: Apply a date range and barber filter, verify only matching results are returned.

### Implementation for User Story 2

- [ ] T006 [P] [US2] Create `BookingFilters` component with Status, Date From, Date To, and Barber dropdowns in `src/features/bookings/components/BookingFilters.tsx`
- [ ] T007 [US2] Integrate `BookingFilters` into `BookingsPage.tsx` and ensure it interacts with the data fetching layer in `src/features/bookings/BookingsPage.tsx`

---

## Phase 5: User Story 3 - Shareable Filtered Views (Priority: P3)

**Goal**: Synchronize filter state with URL search parameters.

**Independent Test**: Change filters, refresh the page, and verify filters are retained from the URL.

### Implementation for User Story 3

- [ ] T008 [US3] Update `useBookings` hook to read from `useSearchParams` and include filter state in the `queryKey` in `src/features/bookings/hooks/useBookings.ts`
- [ ] T009 [US3] Implement URL synchronization logic in `BookingFilters.tsx` to update `searchParams` on change in `src/features/bookings/components/BookingFilters.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and verification.

- [ ] T010 [P] Ensure mobile responsiveness for the filter component and booking cards
- [ ] T011 Run `quickstart.md` validation steps

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**
2. **Foundational (Phase 2)** (Blocks all User Stories)
3. **User Story 1 (Phase 3)** (MVP priority)
4. **User Story 2 & 3 (Phase 4 & 5)** (Can proceed after US1)

### Parallel Opportunities
- T004 and T005 can be started simultaneously if the API method (T003) is defined.
- T006 (UI) can be started in parallel with T007/T008 (Logic).

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Foundation (Phase 2).
2. Complete US1 (Phase 3).
3. Validate Accept/Reject actions.

### Incremental Delivery
1. Add Advanced Filtering (US2).
2. Add URL Synchronization (US3).
3. Final Polish and Responsiveness check.

# Feature Specification: Booking Filters and Admin Actions

**Feature Branch**: `001-booking-filters-actions`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "فى صفحة ال booking ضيف زرار ان انا اقبل او ارفض وكمان ضيف كمبوننت فلتر بالحالة و التاريخ من و الى بس و الحلاق واستخدم ال searchparams مع tanstackquery وطبعا اللوجيك يبقى موجود فى الفنكشن اللى بتجيب ال booking"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Decision on Bookings (Priority: P1)

As an administrator, I want to accept or reject pending bookings directly from the bookings list so I can manage the salon schedule efficiently.

**Why this priority**: This is the core operational requirement for the admin dashboard. Without it, the booking lifecycle remains stuck in the 'pending' state.

**Independent Test**: Can be tested by navigating to the Bookings page as an admin, identifying a 'pending' booking, and clicking the 'Accept' or 'Reject' buttons. Success is verified by the status updating in the UI and database.

**Acceptance Scenarios**:

1. **Given** a booking with `status: 'pending'`, **When** an admin clicks "Accept", **Then** the status changes to "Confirmed" and a success toast appears.
2. **Given** a booking with `status: 'pending'`, **When** an admin clicks "Reject", **Then** the status changes to "Cancelled" and a success toast appears.

---

### User Story 2 - Advanced Booking Filtering (Priority: P2)

As an administrator, I want to filter the bookings list by status, date range, and barber so I can find specific appointments and analyze the schedule for specific periods or staff members.

**Why this priority**: Essential for managing high volumes of data and focusing on specific operational needs (e.g., checking tomorrow's schedule for a specific barber).

**Independent Test**: Apply a date range and select a specific barber. Verify that the list only contains bookings that match both criteria.

**Acceptance Scenarios**:

1. **Given** a list of bookings, **When** a "Date From" and "Date To" are selected, **Then** only bookings within that range (inclusive) are displayed.
2. **Given** a list of bookings, **When** a specific Barber is selected from the dropdown, **Then** only bookings assigned to that barber are displayed.

---

### User Story 3 - Shareable Filtered Views (Priority: P3)

As an administrator, I want my active filters to be reflected in the URL so I can refresh the page or share a specific filtered view with others.

**Why this priority**: Improves usability and allows for deep-linking into specific administrative views.

**Independent Test**: Set multiple filters, copy the current browser URL, open it in a new incognito window or tab, and verify the same filters are applied automatically.

**Acceptance Scenarios**:

1. **Given** active filters on the page, **When** the page is refreshed, **Then** the filters remain active and the data remains filtered accordingly.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide "Accept" and "Reject" buttons on every booking card with a `pending` status for admin users.
- **FR-002**: System MUST update the booking status in the database upon admin action using a dedicated mutation.
- **FR-003**: System MUST show a loading state (e.g., spinner) on the specific action button while the update is in progress.
- **FR-004**: System MUST provide a filter component at the top of the bookings page.
- **FR-005**: Filter component MUST include: Status dropdown (All, Pending, Confirmed, Completed, Cancelled), Date From picker, Date To picker, and Barber dropdown.
- **FR-006**: System MUST synchronize all filter values with URL `searchParams` (e.g., `?status=pending&from=2024-01-01&to=2024-01-07&barberId=...`).
- **FR-007**: The data fetching logic (API call) MUST accept these filter parameters and apply them to the Supabase query.

### Key Entities

- **Booking**: The primary record containing appointment details (date, time, status, user_id, barber_id, service_id).
- **Barber**: Staff member record used to populate the barber filter dropdown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can update a booking status with a single click and receive visual confirmation within 2 seconds.
- **SC-002**: Filter results update in the UI automatically within 500ms of any filter value change.
- **SC-003**: 100% of filter states are accurately represented in the URL query string.

## Assumptions

- Admins have the necessary permissions to update booking records.
- The "Date From" and "Date To" filters default to empty (no range restriction).
- Selecting "All" in a dropdown removes that specific filter from the query.

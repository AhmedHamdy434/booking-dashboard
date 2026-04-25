# Quickstart: Booking Management Verification

## Development Setup

1. Ensure the dev server is running: `npm run dev`.
2. Navigate to the Bookings page: `http://localhost:5173/bookings`.

## Verification Steps

### 1. Filtering & URL Sync
- Select a status (e.g., "Pending") in the filter dropdown.
- **Check**: Verify the URL updates to include `?status=pending`.
- **Check**: Verify the list only shows pending bookings.
- Change the date range using the date pickers.
- **Check**: Verify the URL updates with `from=...` and `to=...`.
- Refresh the page.
- **Check**: Verify that all filters are automatically reapplied from the URL.

### 2. Admin Actions
- Locate a "Pending" booking card.
- Click the **Accept** button.
- **Check**: Button should show a loading spinner briefly.
- **Check**: Card should update to "Confirmed" status (emerald badge).
- **Check**: Success toast should appear.
- Repeat with **Reject** and verify status changes to "Cancelled" (rose badge).

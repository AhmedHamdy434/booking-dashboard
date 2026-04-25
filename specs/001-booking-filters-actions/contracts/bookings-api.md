# API Contract: Booking Management

## Interface: `bookingsApi`

### `getBookings(filters?: BookingFilters): Promise<Booking[]>`

Retrieves a list of bookings based on optional filters.

**Parameters:**
- `filters` (Object):
    - `status` (string, optional): Filter by booking status.
    - `startDate` (string, optional): ISO date string (YYYY-MM-DD).
    - `endDate` (string, optional): ISO date string (YYYY-MM-DD).
    - `barberId` (string, optional): Filter by specific barber UUID.

**Returns:**
- Array of `Booking` objects with joined `services` and `barbers` data.

---

### `updateStatus(id: string, status: Booking['status']): Promise<void>`

Updates the status of a specific booking.

**Parameters:**
- `id` (string): UUID of the booking to update.
- `status` (string): The new status ('confirmed' or 'cancelled').

**Returns:**
- `Promise<void>`: Resolves on success, throws on Supabase error.

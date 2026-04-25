# Data Model: Booking Management

## Entities

### Booking (Extended)
The primary entity for appointment tracking.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Reference to auth.users |
| service_id | UUID | Reference to services table |
| barber_id | UUID | Reference to barbers table |
| date | Date | ISO string (YYYY-MM-DD) |
| time | String | Time slot (HH:MM) |
| status | Enum | 'pending', 'confirmed', 'completed', 'cancelled' |
| created_at | DateTime | Auto-generated timestamp |

## Relationships

- **Booking -> Service**: Many-to-One (Fetch service name and duration).
- **Booking -> Barber**: Many-to-One (Fetch barber name).

## Validation Rules

1. **Status Transition**: 
   - `pending` -> `confirmed` (Admin Accept)
   - `pending` -> `cancelled` (Admin Reject)
   - `confirmed` -> `completed` (Automatic/Manual after time passes)
2. **Date Filtering**: Comparisons are inclusive (`gte` and `lte`).

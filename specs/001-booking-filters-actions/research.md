# Research: Booking Filters and URL Synchronization

## 1. Syncing SearchParams with TanStack Query

### Decision
Utilize the `useSearchParams` hook from `react-router-dom` as the "Source of Truth" for filter state.

### Rationale
- **Consistency**: The URL is always up-to-date, allowing for easy sharing and refreshing.
- **Simplicity**: TanStack Query automatically triggers a fetch when the `queryKey` changes. By including the filter state in the `queryKey`, we eliminate the need for manual `useEffect` or state synchronization logic.
- **Browser History**: Users can use the back button to navigate through filter changes.

### Alternatives Considered
- **Local State + useEffect**: Rejected because it creates a "dual source of truth" (state vs URL) and is prone to synchronization bugs.
- **Zustand/Global State**: Rejected as it adds unnecessary complexity for state that is already naturally represented in the URL.

## 2. Date Range Filtering Implementation

### Decision
Implement a custom `BookingFilters` component using Shadcn's `Calendar` (with `Popover`) and `Select` components.

### Rationale
- **Premium UX**: Consistent with the project's "Premium Aesthetics" principle.
- **Accessibility**: Shadcn components are built on Radix UI, providing best-in-class accessibility.

### Implementation Pattern
```ts
// Hook pattern
const [searchParams, setSearchParams] = useSearchParams();
const filters = {
  status: searchParams.get('status') || 'all',
  from: searchParams.get('from'),
  to: searchParams.get('to'),
  barberId: searchParams.get('barberId'),
};

const { data } = useQuery({
  queryKey: ['bookings', filters],
  queryFn: () => bookingsApi.getBookings(filters),
});
```

## 3. Supabase Filter Logic

### Decision
Apply conditional filters in the `bookingsApi.ts` layer.

### Pattern
```ts
let query = supabase.from('bookings').select('...');

if (filters.status && filters.status !== 'all') {
  query = query.eq('status', filters.status);
}
if (filters.startDate) {
  query = query.gte('date', filters.startDate);
}
// ...etc
```

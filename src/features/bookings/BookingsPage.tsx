import { useBookings } from './hooks/useBookings';
import { BookingsTable } from './components/BookingsTable';

export const BookingsPage = () => {
  const { data: bookings, isLoading } = useBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all user bookings and appointments.
        </p>
      </div>

      <BookingsTable bookings={bookings} isLoading={isLoading} />
    </div>
  );
};

export default BookingsPage;

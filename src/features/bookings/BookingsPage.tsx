import { useBookings } from './hooks/useBookings';
import { BookingsList } from './components/BookingsList';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingsPage = () => {
  const { data: bookings, isLoading } = useBookings();
  const { data: profile } = useProfile();

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'View and manage all user bookings and appointments.' 
              : 'View your booking history and upcoming appointments.'}
          </p>
        </div>
        {!isAdmin && (
          <Button asChild>
            <Link to="/bookings/new">
              <Plus className="mr-2 h-4 w-4" /> New Booking
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-6">
        <BookingsList bookings={bookings} isLoading={isLoading} isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default BookingsPage;

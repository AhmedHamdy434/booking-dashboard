import type { Booking } from '@/types/booking';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ClipboardList, RefreshCw, Calendar, Clock, Scissors, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

interface BookingsListProps {
  bookings: Booking[] | undefined;
  isLoading: boolean;
  isAdmin?: boolean;
}

export const BookingsList = ({ bookings, isLoading, isAdmin = false }: BookingsListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-2 w-full rounded-none" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                   <Skeleton className="h-5 w-3/4" />
                   <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
           <ClipboardList className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">No bookings yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {isAdmin 
            ? "You don't have any upcoming bookings. They will appear here once customers start booking your services."
            : "You haven't made any bookings yet. Book an appointment to get started!"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
        </Button>
      </div>
    );
  }

  const isPast = (dateStr: string, timeStr: string) => {
    try {
      const bookingDate = parseISO(`${dateStr}T${timeStr}`);
      return bookingDate < new Date();
    } catch {
      return false;
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => {
        const past = isPast(booking.date, booking.time);
        
        return (
          <Card 
            key={booking.id} 
            className={`overflow-hidden transition-all hover:shadow-md ${past ? 'opacity-70 bg-slate-50 dark:bg-slate-900/50' : 'bg-card'}`}
          >
            <div className={`h-1.5 w-full ${past ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary'}`} />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {booking.services?.name || 'Unknown Service'}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Scissors className="w-3.5 h-3.5 mr-1.5" />
                    {booking.barbers?.name || 'Unknown Barber'}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  past 
                    ? 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-400' 
                    : 'bg-primary/10 text-primary ring-primary/20'
                }`}>
                  {past ? 'Past' : 'Upcoming'}
                </span>
              </div>

              <div className="space-y-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="font-medium">
                    {format(parseISO(booking.date), 'EEEE, MMM do, yyyy')}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="font-medium">{booking.time}</span>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center text-xs text-muted-foreground mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <User className="w-3.5 h-3.5 mr-2" />
                    <span className="font-mono truncate" title={booking.user_id}>
                      ID: {booking.user_id.substring(0, 12)}...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

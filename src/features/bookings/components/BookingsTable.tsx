import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Booking } from '@/types/booking';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ClipboardList, RefreshCw } from 'lucide-react';

interface BookingsTableProps {
  bookings: Booking[] | undefined;
  isLoading: boolean;
}

export const BookingsTable = ({ bookings, isLoading }: BookingsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
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
          You don't have any upcoming bookings. They will appear here once customers start booking your services.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Barber</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {booking.id.substring(0, 8)}...
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {booking.user_id.substring(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">
                {booking.services?.name || 'Unknown Service'}
              </TableCell>
              <TableCell>
                {booking.barbers?.name || 'Unknown Barber'}
              </TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

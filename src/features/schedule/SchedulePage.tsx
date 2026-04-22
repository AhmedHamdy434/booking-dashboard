import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';

export const SchedulePage = () => {
  const { data: bookings, isLoading } = useBookings();

  // Transform bookings to FullCalendar events
  const events = bookings?.map((booking) => ({
    id: booking.id,
    title: booking.services?.name || 'Booking',
    start: `${booking.date}T${booking.time}`,
    // Assuming duration is 30 mins if not specified, or we could fetch it
    extendedProps: {
      userId: booking.user_id,
    },
  })) || [];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
           <CalendarIcon className="h-8 w-8 text-primary" />
           Business Schedule
        </h1>
        <p className="text-muted-foreground">
          View and manage your appointments across different time scales.
        </p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800">
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              height="auto"
              aspectRatio={1.5}
              eventColor="#7c3aed"
              eventTextColor="#ffffff"
              dayMaxEvents={true}
              nowIndicator={true}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
            />
          </div>
        </CardContent>
      </Card>

      <style>{`
        .fc {
          --fc-button-bg-color: transparent;
          --fc-button-border-color: #e2e8f0;
          --fc-button-text-color: #64748b;
          --fc-button-hover-bg-color: #f1f5f9;
          --fc-button-hover-border-color: #e2e8f0;
          --fc-button-active-bg-color: #7c3aed;
          --fc-button-active-border-color: #7c3aed;
          --fc-button-active-text-color: #ffffff;
          --fc-border-color: #e2e8f0;
          --fc-event-bg-color: #7c3aed;
          --fc-event-border-color: #7c3aed;
          font-family: inherit;
        }
        .dark .fc {
          --fc-button-border-color: #1e293b;
          --fc-button-text-color: #94a3b8;
          --fc-button-hover-bg-color: #1e293b;
          --fc-button-hover-border-color: #1e293b;
          --fc-border-color: #1e293b;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
          background-color: var(--fc-button-active-bg-color);
          border-color: var(--fc-button-active-border-color);
          color: var(--fc-button-active-text-color);
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid var(--fc-border-color);
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .fc .fc-col-header-cell-cushion {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--muted-foreground);
          padding: 8px 0;
        }
        .fc-daygrid-day-number {
          font-size: 0.875rem;
          padding: 8px !important;
          color: var(--muted-foreground);
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;

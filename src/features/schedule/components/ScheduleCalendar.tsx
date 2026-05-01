import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import arLocale from '@fullcalendar/core/locales/ar';
import { ScheduleSkeleton } from './ScheduleSkeleton';

export const ScheduleCalendar = () => {
  const { t, i18n } = useTranslation();
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) {
    return <ScheduleSkeleton />;
  }

  // Transform bookings to FullCalendar events
  const events = bookings?.map((booking) => ({
    id: booking.id,
    title: booking.services?.name || t('bookings.unknown_service'),
    start: `${booking.date}T${booking.time}`,
    extendedProps: {
      userId: booking.user_id,
    },
  })) || [];

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle>{t('schedule.calendar_view')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={i18n.language === 'ar' ? arLocale : 'en'}
            direction={i18n.dir()}
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            height="auto"
            aspectRatio={1.5}
            eventColor="var(--primary)"
            eventTextColor="var(--primary-foreground)"
            dayMaxEvents={true}
            nowIndicator={true}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
          />
        </div>
      </CardContent>

      <style>{`
        .fc {
          --fc-button-bg-color: transparent;
          --fc-button-border-color: var(--border);
          --fc-button-text-color: var(--muted-foreground);
          --fc-button-hover-bg-color: var(--accent);
          --fc-button-hover-border-color: var(--border);
          --fc-button-active-bg-color: var(--primary);
          --fc-button-active-border-color: var(--primary);
          --fc-button-active-text-color: var(--primary-foreground);
          --fc-border-color: var(--border);
          --fc-event-bg-color: var(--primary);
          --fc-event-border-color: var(--primary);
          font-family: inherit;
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
    </Card>
  );
};

import { Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ScheduleCalendar } from './components/ScheduleCalendar';

export const SchedulePage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
           <CalendarIcon className="h-8 w-8 text-primary" />
           {t('schedule.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('schedule.subtitle')}
        </p>
      </div>

      <ScheduleCalendar />
    </div>
  );
};

export default SchedulePage;

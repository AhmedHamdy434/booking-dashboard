import { useBarbers } from '@/features/barbers/hooks/useBarbers';
import { URLSelect } from '@/components/shared/URLSelect';
import { URLDatePicker } from '@/components/shared/URLDatePicker';
import { User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const BookingFilters = () => {
  const { t } = useTranslation();
  const { data: barbers } = useBarbers();

  const barberOptions = useMemo(() => [
    { label: t('bookings.all_barbers'), value: 'all' },
    ...(barbers?.map(b => ({ label: b.name, value: b.id })) || [])
  ], [barbers, t]);

  const statusOptions = [
    { label: t('bookings.all_statuses'), value: 'all' },
    { label: t('bookings.status_pending'), value: 'pending' },
    { label: t('bookings.status_confirmed'), value: 'confirmed' },
    { label: t('bookings.status_completed'), value: 'completed' },
    { label: t('bookings.status_cancelled'), value: 'cancelled' },
  ];

  return (
    <Card className="border-slate-200/60 dark:border-slate-800 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <URLSelect 
            label={t('bookings.status')} 
            paramKey="status" 
            options={statusOptions} 
            icon={Tag} 
          />

          <URLSelect 
            label={t('bookings.barber')} 
            paramKey="barberId" 
            options={barberOptions} 
            icon={User} 
          />

          <URLDatePicker 
            label={t('bookings.from_date')} 
            paramKey="startDate" 
            placeholder={t('bookings.start_date_placeholder')}
          />

          <URLDatePicker 
            label={t('bookings.to_date')} 
            paramKey="endDate" 
            placeholder={t('bookings.end_date_placeholder')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
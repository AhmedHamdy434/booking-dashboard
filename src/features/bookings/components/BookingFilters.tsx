import { useBarbers } from '@/features/barbers/hooks/useBarbers';
import { URLSelect } from '@/components/shared/URLSelect';
import { URLDatePicker } from '@/components/shared/URLDatePicker';
import { User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

export const BookingFilters = () => {
  const { data: barbers } = useBarbers();

  const barberOptions = useMemo(() => [
    { label: 'All Barbers', value: 'all' },
    ...(barbers?.map(b => ({ label: b.name, value: b.id })) || [])
  ], [barbers]);

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <Card className="border-slate-200/60 dark:border-slate-800 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <URLSelect 
            label="Status" 
            paramKey="status" 
            options={statusOptions} 
            icon={Tag} 
          />

          <URLSelect 
            label="Barber" 
            paramKey="barberId" 
            options={barberOptions} 
            icon={User} 
          />

          <URLDatePicker 
            label="From Date" 
            paramKey="startDate" 
            placeholder="Start date"
          />

          <URLDatePicker 
            label="To Date" 
            paramKey="endDate" 
            placeholder="End date"
          />
        </div>
      </CardContent>
    </Card>
  );
};
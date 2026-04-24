import { useState, useEffect } from 'react';
import { useBarbers, useBarberAvailability, useUpsertAvailability, useDeleteAvailabilityDay } from './hooks/useBarbers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import type { UpsertAvailabilityDTO } from '@/types/barber';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const AvailabilityPage = () => {
  const { data: barbers, isLoading: isLoadingBarbers } = useBarbers();
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  
  const { data: availabilityData, isLoading: isLoadingAvailability } = useBarberAvailability(selectedBarberId);
  const { mutate: upsertAvailability, isPending: isSaving } = useUpsertAvailability(selectedBarberId);
  const { mutate: deleteAvailabilityDay } = useDeleteAvailabilityDay(selectedBarberId);

  // Local state for the schedule form
  const [schedule, setSchedule] = useState<Record<number, { isWorking: boolean; start_time: string; end_time: string }>>({});

  // Initialize schedule form with data
  useEffect(() => {
    const newSchedule: Record<number, { isWorking: boolean; start_time: string; end_time: string }> = {};
    
    // Set default values for all days
    DAYS_OF_WEEK.forEach(day => {
      newSchedule[day.value] = {
        isWorking: false,
        start_time: '09:00',
        end_time: '17:00'
      };
    });

    // Override with fetched data
    if (availabilityData) {
      availabilityData.forEach(avail => {
        newSchedule[avail.day_of_week] = {
          isWorking: true,
          // Format time to HH:mm (database might return HH:mm:ss)
          start_time: avail.start_time.substring(0, 5),
          end_time: avail.end_time.substring(0, 5)
        };
      });
    }

    setSchedule(newSchedule);
  }, [availabilityData, selectedBarberId]);

  const handleSave = () => {
    if (!selectedBarberId) return;

    const toUpsert: UpsertAvailabilityDTO[] = [];
    
    Object.entries(schedule).forEach(([dayStr, data]) => {
      const day = parseInt(dayStr, 10);
      
      if (data.isWorking) {
        if (!data.start_time || !data.end_time) {
            toast.error(`Please provide start and end times for ${DAYS_OF_WEEK[day].label}`);
            return;
        }
        if (data.start_time >= data.end_time) {
             toast.error(`Start time must be before end time for ${DAYS_OF_WEEK[day].label}`);
             return;
        }

        toUpsert.push({
          barber_id: selectedBarberId,
          day_of_week: day,
          start_time: data.start_time,
          end_time: data.end_time
        });
      } else {
        // If they were working before but now aren't, we need to delete it
        const wasWorking = availabilityData?.some(a => a.day_of_week === day);
        if (wasWorking) {
          deleteAvailabilityDay({ barberId: selectedBarberId, dayOfWeek: day });
        }
      }
    });

    if (toUpsert.length > 0) {
      upsertAvailability(toUpsert);
    } else if (availabilityData && availabilityData.length === 0) {
       toast.success("No working days selected");
    } else {
      // If nothing to upsert but maybe we deleted some, toast success here since we didn't call upsert
      toast.success("Availability updated successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Barber Availability</h1>
        <p className="text-muted-foreground">
          Define working hours for each barber.
        </p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm max-w-3xl">
        <CardHeader>
          <CardTitle>Select Barber</CardTitle>
          <CardDescription>Choose a barber to manage their schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBarbers ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading barbers...</span>
            </div>
          ) : (
            <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a barber..." />
              </SelectTrigger>
              <SelectContent>
                {barbers?.map(barber => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name} {!barber.is_active && '(Inactive)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedBarberId && (
        <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Set the working hours for the selected barber.</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={isSaving || isLoadingAvailability}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Schedule
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingAvailability ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day.value} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex items-center space-x-2 sm:w-1/3">
                      <Checkbox 
                        id={`day-${day.value}`} 
                        checked={schedule[day.value]?.isWorking || false}
                        onCheckedChange={(checked) => 
                          setSchedule(prev => ({
                            ...prev,
                            [day.value]: { ...prev[day.value], isWorking: checked as boolean }
                          }))
                        }
                      />
                      <label 
                        htmlFor={`day-${day.value}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {day.label}
                      </label>
                    </div>
                    
                    <div className={`flex items-center gap-2 flex-1 transition-opacity ${schedule[day.value]?.isWorking ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <div className="grid gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">Start Time</Label>
                        <Input 
                          type="time" 
                          value={schedule[day.value]?.start_time || ''}
                          onChange={(e) => 
                            setSchedule(prev => ({
                              ...prev,
                              [day.value]: { ...prev[day.value], start_time: e.target.value }
                            }))
                          }
                        />
                      </div>
                      <span className="text-muted-foreground mt-5">-</span>
                      <div className="grid gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">End Time</Label>
                        <Input 
                          type="time" 
                          value={schedule[day.value]?.end_time || ''}
                          onChange={(e) => 
                            setSchedule(prev => ({
                              ...prev,
                              [day.value]: { ...prev[day.value], end_time: e.target.value }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityPage;

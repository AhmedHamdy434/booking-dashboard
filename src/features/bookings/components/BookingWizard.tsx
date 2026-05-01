import { useState, useMemo } from 'react';
import { useServices } from '@/features/services/hooks/useServices';
import { useBarbers, useBarberAvailability } from '@/features/barbers/hooks/useBarbers';
import { useCreateBooking } from '../hooks/useBookings';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { Loader2, Calendar, Scissors, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Service } from '@/types/service';
import type { Barber } from '@/types/barber';
import { useTranslation } from 'react-i18next';
import { BookingWizardSkeleton } from './BookingWizardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export const BookingWizard = ({ onComplete }: { onComplete?: () => void }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: barbers, isLoading: isLoadingBarbers } = useBarbers();
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: availability, isLoading: isLoadingAvailability } = useBarberAvailability(selectedBarber?.id);

  // const dateLocale = i18n.language === 'ar' ? arSA : undefined;

  // Filter out inactive barbers
  const activeBarbers = useMemo(() => barbers?.filter(b => b.is_active) || [], [barbers]);

  // Get current day availability
  const currentDayAvailability = useMemo(() => {
    if (!selectedDate || !availability) return null;
    const dateObj = parseISO(selectedDate);
    const dayOfWeek = dateObj.getDay();
    return availability.find(a => a.day_of_week === dayOfWeek) || null;
  }, [selectedDate, availability]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleBooking = () => {
    if (!user || !selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

    createBooking(
      {
        user_id: user.id,
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        date: selectedDate,
        time: selectedTime,
        status: 'pending'
      },
      {
        onSuccess: () => {
          setStep(4); // Success step
          if (onComplete) onComplete();
        }
      }
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === i 
              ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
              : step > i 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
          }`}>
            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
          </div>
          <span className={`text-xs mt-2 ${step === i ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {i === 1 ? t('wizard.step_service') : i === 2 ? t('wizard.step_barber') : t('wizard.step_time')}
          </span>
        </div>
      ))}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 w-64 h-0.5 bg-muted z-0">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${(Math.min(step, 3) - 1) * 50}%` }}
        />
      </div>
    </div>
  );

  if (isLoadingServices || isLoadingBarbers) {
    return <BookingWizardSkeleton />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {step < 4 && renderStepIndicator()}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">{t('wizard.select_service')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {services?.map(service => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${selectedService?.id === service.id ? 'border-primary ring-1 ring-primary' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mt-2 gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 ms-1 me-1" /> {service.duration} {t('common.mins')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <span className="font-bold text-lg">{service.price} {t('common.currency')}</span>
                      <Button variant="ghost" size="sm" className="group">
                        {t('common.select')} <ArrowRight className="w-4 h-4 ms-2 me-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Select Barber */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 ms-2 me-2 rtl:rotate-180" /> {t('common.back')}
              </Button>
              <h2 className="text-2xl font-bold flex-1 text-center pe-12">{t('wizard.select_barber')}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeBarbers.map(barber => (
                <Card 
                  key={barber.id} 
                  className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${selectedBarber?.id === barber.id ? 'border-primary ring-1 ring-primary' : ''}`}
                  onClick={() => handleBarberSelect(barber)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300">
                      {barber.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{barber.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400">
                        {t('common.status_active')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeBarbers.length === 0 && (
                <div className="col-span-full text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                  {t('wizard.no_active_barbers')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Pick Date & Time */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 ms-2 me-2 rtl:rotate-180" /> {t('common.back')}
              </Button>
              <h2 className="text-2xl font-bold flex-1 text-center pe-12">{t('wizard.select_date_time')}</h2>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('wizard.select_date')}</label>
                    <div className="relative">
                      <Calendar className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 ms-2" />
                      <Input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime(null);
                        }}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="ps-10 pe-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('wizard.select_start_time')}</label>
                    <div className="relative">
                      <Clock className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 ms-2" />
                      <Input 
                        type="time" 
                        value={selectedTime || ''} 
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="ps-10 pe-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('wizard.time_desc')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {isLoadingAvailability ? (
                    <div className="space-y-2">
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                  ) : currentDayAvailability ? (
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg text-sm">
                      <div className="flex items-center text-green-800 dark:text-green-400 font-medium mb-1">
                        <Clock className="w-4 h-4 ms-2 me-2" />
                        {t('wizard.working_hours_today')}
                      </div>
                      <p className="text-green-700 dark:text-green-500">
                        {t('wizard.is_available_from', { name: selectedBarber?.name })} <span className="font-bold">{currentDayAvailability.start_time.substring(0, 5)}</span> {t('wizard.to')} <span className="font-bold">{currentDayAvailability.end_time.substring(0, 5)}</span>
                      </p>
                    </div>
                  ) : selectedDate && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg text-sm">
                      <p className="text-red-700 dark:text-red-500 font-medium">
                        {t('wizard.not_working_today', { name: selectedBarber?.name })}
                      </p>
                    </div>
                  )}

                  {selectedService && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-sm flex items-center justify-between">
                        <span className="text-muted-foreground">{t('common.estimated_duration')}:</span>
                        <span className="font-semibold">{selectedService.duration} {t('common.mins')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button 
                size="lg" 
                onClick={handleBooking} 
                disabled={!selectedTime || !selectedDate || !currentDayAvailability || isCreating}
                className="w-full sm:w-auto"
              >
                {isCreating ? <Loader2 className="w-4 h-4 ms-2 me-2 animate-spin" /> : null}
                {t('wizard.confirm_booking')}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t('wizard.booking_confirmed')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              {t('wizard.success_desc', { 
                barber: selectedBarber?.name, 
                service: selectedService?.name, 
                date: selectedDate, 
                time: selectedTime 
              })}
            </p>
            <div className="pt-8">
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('wizard.make_another')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

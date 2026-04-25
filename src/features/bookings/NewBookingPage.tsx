import { BookingWizard } from './components/BookingWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NewBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link to="/bookings">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('wizard.new_booking')}</h1>
          <p className="text-muted-foreground">
            {t('wizard.wizard_desc')}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 sm:p-8 shadow-sm">
        <BookingWizard onComplete={() => {
           // Provide a slight delay so user sees success step, or let them stay on success step
           setTimeout(() => {
             navigate('/bookings');
           }, 3000);
        }} />
      </div>
    </div>
  );
};

export default NewBookingPage;

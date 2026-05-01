import { useCreateService, type ServiceFormValues } from './hooks/useServices';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ServiceForm } from './components/ServiceForm';

export const NewServicePage = () => {
  const { t } = useTranslation();
  const { mutate: createService, isPending } = useCreateService();

  const onSubmit = (data: ServiceFormValues) => {
    createService(data);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{t('services.add_title')}</h1>
      </div>

      <ServiceForm
        onSubmit={onSubmit}
        isPending={isPending}
        title={t('services.details')}
      />
    </div>
  );
};

export default NewServicePage;

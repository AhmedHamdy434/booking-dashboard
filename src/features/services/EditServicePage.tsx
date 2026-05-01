import { useService, useUpdateService, type ServiceFormValues } from './hooks/useServices';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ServiceForm } from './components/ServiceForm';
import { ServiceFormSkeleton } from './components/ServiceFormSkeleton';

export const EditServicePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: service, isLoading } = useService(id);
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();

  const onSubmit = (data: ServiceFormValues) => {
    if (id) {
      updateService({ id, ...data }, {
        onSuccess: () => navigate('/services')
      });
    }
  };

  if (isLoading) {
    return <ServiceFormSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('services.edit_title')}</h1>
      </div>

      <ServiceForm
        initialValues={service ? {
          name: service.name,
          description: service.description || '',
          duration: service.duration,
          price: service.price || 0,
        } : undefined}
        onSubmit={onSubmit}
        isPending={isUpdating}
        title={t('services.details')}
      />
    </div>
  );
};

export default EditServicePage;

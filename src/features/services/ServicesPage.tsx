import { useServices } from './hooks/useServices';
import { ServicesTable } from './components/ServicesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ServicesPage = () => {
  const { t } = useTranslation();
  const { data: services, isLoading } = useServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('services.title')}</h1>
          <p className="text-muted-foreground">
            {t('services.subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mx-2 h-4 w-4" /> {t('services.add_new')}
          </Link>
        </Button>
      </div>

      <ServicesTable services={services} isLoading={isLoading} />
    </div>
  );
};

export default ServicesPage;

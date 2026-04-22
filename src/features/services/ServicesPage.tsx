import { useServices } from './hooks/useServices';
import { ServicesTable } from './components/ServicesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage = () => {
  const { data: services, isLoading } = useServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the list of services offered by the booking system.
          </p>
        </div>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Link>
        </Button>
      </div>

      <ServicesTable services={services} isLoading={isLoading} />
    </div>
  );
};

export default ServicesPage;

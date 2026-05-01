import { useState, useCallback } from 'react';
import { BarberDialog } from './components/BarberDialog';
import { BarbersList } from './components/BarbersList';
import type { Barber } from '@/types/barber';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BarbersPage = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(undefined);

  const handleEdit = useCallback((barber: Barber) => {
    setSelectedBarber(barber);
    setDialogOpen(true);
  }, []);

  const handleAddBarber = () => {
    setSelectedBarber(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('barbers.title')}</h1>
          <p className="text-muted-foreground">
            {t('barbers.subtitle')}
          </p>
        </div>
        <Button onClick={handleAddBarber}>
          <Plus className="me-2 h-4 w-4" /> {t('barbers.add_new')}
        </Button>
      </div>

      <BarbersList onEdit={handleEdit} onAddBarber={handleAddBarber} />

      <BarberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barber={selectedBarber}
      />
    </div>
  );
};

export default BarbersPage;

import { useState, useCallback, memo } from 'react';
import { useBarbers, useToggleBarberStatus, useDeleteBarber } from './hooks/useBarbers';
import { BarberDialog } from './components/BarberDialog';
import type { Barber } from '@/types/barber';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, MoreVertical, Pencil, Trash2, Scissors } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BarberRow = memo(({ 
  barber, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: { 
  barber: Barber; 
  onEdit: (barber: Barber) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const { t } = useTranslation();
  
  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {barber.id.substring(0, 8)}...
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={barber.image_url} alt={barber.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {barber.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{barber.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm max-w-[250px] truncate">
        {barber.bio || '-'}
      </TableCell>
      <TableCell>
        <Switch
          checked={barber.is_active}
          onCheckedChange={() => onToggleStatus(barber.id, barber.is_active)}
        />
      </TableCell>
      <TableCell>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(barber)}>
                <Pencil className="mr-2 h-4 w-4 ml-2 mr-2" /> {t('common.edit')}
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4 ml-2 mr-2" /> {t('common.delete')}
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('common.confirm_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('barbers.delete_confirmation', { name: barber.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(barber.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
});
BarberRow.displayName = 'BarberRow';

export const BarbersPage = () => {
  const { t } = useTranslation();
  const { data: barbers, isLoading } = useBarbers();
  const { mutate: toggleStatus } = useToggleBarberStatus();
  const { mutate: deleteBarber } = useDeleteBarber();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(undefined);

  const handleEdit = useCallback((barber: Barber) => {
    setSelectedBarber(barber);
    setDialogOpen(true);
  }, []);

  const handleToggleStatus = useCallback((id: string, currentStatus: boolean) => {
    toggleStatus({ id, is_active: !currentStatus });
  }, [toggleStatus]);

  const handleDelete = useCallback((id: string) => {
    deleteBarber(id);
  }, [deleteBarber]);

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
          <Plus className="mr-2 h-4 w-4 ml-2 mr-2" /> {t('barbers.add_new')}
        </Button>
      </div>

      <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : !barbers || barbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
               <Scissors className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">{t('barbers.no_barbers')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t('barbers.empty_description')}
            </p>
            <Button onClick={handleAddBarber}>
              <Plus className="mr-2 h-4 w-4 ml-2 mr-2" /> {t('barbers.add_new')}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('barbers.id_header')}</TableHead>
                <TableHead>{t('barbers.name_header')}</TableHead>
                <TableHead>{t('barbers.bio_label')}</TableHead>
                <TableHead>{t('barbers.active_header')}</TableHead>
                <TableHead className="w-16">{t('barbers.actions_header')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbers.map((barber) => (
                <BarberRow
                  key={barber.id}
                  barber={barber}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <BarberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barber={selectedBarber}
      />
    </div>
  );
};

export default BarbersPage;

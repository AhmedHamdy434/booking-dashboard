import { memo, useCallback } from 'react';
import { useBarbers, useToggleBarberStatus, useDeleteBarber } from '../hooks/useBarbers';
import type { Barber } from '@/types/barber';
import { Button } from '@/components/ui/button';
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
import { BarbersListSkeleton } from './BarbersListSkeleton';

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
                <Pencil className="me-2 h-4 w-4" /> {t('common.edit')}
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Trash2 className="me-2 h-4 w-4" /> {t('common.delete')}
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

interface BarbersListProps {
  onEdit: (barber: Barber) => void;
  onAddBarber: () => void;
}

export const BarbersList = ({ onEdit, onAddBarber }: BarbersListProps) => {
  const { t } = useTranslation();
  const { data: barbers, isLoading } = useBarbers();
  const { mutate: toggleStatus } = useToggleBarberStatus();
  const { mutate: deleteBarber } = useDeleteBarber();

  const handleToggleStatus = useCallback((id: string, currentStatus: boolean) => {
    toggleStatus({ id, is_active: !currentStatus });
  }, [toggleStatus]);

  const handleDelete = useCallback((id: string) => {
    deleteBarber(id);
  }, [deleteBarber]);

  if (isLoading) {
    return <BarbersListSkeleton />;
  }

  if (!barbers || barbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-border rounded-xl bg-muted/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
           <Scissors className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">{t('barbers.no_barbers')}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {t('barbers.empty_description')}
        </p>
        <Button onClick={onAddBarber}>
          <Plus className="me-2 h-4 w-4" /> {t('barbers.add_new')}
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
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
              onEdit={onEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

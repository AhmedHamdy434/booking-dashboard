import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Service } from '@/types/service';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Settings, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeleteService } from '../hooks/useServices';
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
import { useTranslation } from 'react-i18next';

interface ServicesTableProps {
  services: Service[] | undefined;
  isLoading: boolean;
}

export const ServicesTable = ({ services, isLoading }: ServicesTableProps) => {
  const { t } = useTranslation();
  const { mutate: deleteService } = useDeleteService();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-border rounded-2xl bg-muted/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
           <Settings className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">{t('services.no_services')}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {t('services.empty_description')}
        </p>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mr-2 h-4 w-4" /> {t('services.add_new')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('services.id_header')}</TableHead>
            <TableHead>{t('services.name_header')}</TableHead>
            <TableHead>{t('services.duration_header')}</TableHead>
            <TableHead>{t('services.price_header')}</TableHead>
            <TableHead className="w-16">{t('services.actions_header')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {service.id.substring(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.duration} {t('common.mins')}</TableCell>
              <TableCell>{service.price} {t('common.currency')}</TableCell>
              <TableCell>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/services/edit/${service.id}`} className="flex items-center">
                          <Pencil className="mr-2 h-4 w-4 ml-2 mr-2" /> {t('common.edit')}
                        </Link>
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
                        {t('services.delete_confirmation', { name: service.name })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteService(service.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t('common.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

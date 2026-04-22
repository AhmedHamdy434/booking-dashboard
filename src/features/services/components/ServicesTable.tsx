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
import { Settings, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServicesTableProps {
  services: Service[] | undefined;
  isLoading: boolean;
}

export const ServicesTable = ({ services, isLoading }: ServicesTableProps) => {
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
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
           <Settings className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">No services created</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          You don't have any services yet. Create your first service to start accepting bookings.
        </p>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Duration (mins)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {service.id.substring(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.duration} mins</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

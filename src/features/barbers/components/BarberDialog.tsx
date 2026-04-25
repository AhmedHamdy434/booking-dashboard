import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { barberSchema, type BarberFormValues, useCreateBarber, useUpdateBarber } from '../hooks/useBarbers';
import type { Barber } from '@/types/barber';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface BarberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber;
}

export const BarberDialog = ({ open, onOpenChange, barber }: BarberDialogProps) => {
  const { t } = useTranslation();
  const { mutate: createBarber, isPending: isCreating } = useCreateBarber();
  const { mutate: updateBarber, isPending: isUpdating } = useUpdateBarber();

  const isEditing = !!barber;
  const isPending = isCreating || isUpdating;

  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (barber && open) {
      form.reset({
        name: barber.name,
        is_active: barber.is_active,
      });
    } else if (!open) {
      form.reset({
        name: '',
        is_active: true,
      });
    }
  }, [barber, open, form]);

  const onSubmit = (data: BarberFormValues) => {
    if (isEditing) {
      updateBarber(
        { id: barber.id, ...data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createBarber(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('barbers.edit_barber') : t('barbers.add_barber')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('barbers.name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('barbers.name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t('barbers.active_status')}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

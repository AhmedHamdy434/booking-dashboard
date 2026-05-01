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
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea } from '@/components/shared/FormFields';

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
      bio: '',
      image_url: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (barber && open) {
      form.reset({
        name: barber.name,
        bio: barber.bio || '',
        image_url: barber.image_url || '',
        is_active: barber.is_active,
      });
    } else if (!open) {
      form.reset({
        name: '',
        bio: '',
        image_url: '',
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('barbers.edit_barber') : t('barbers.add_barber')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label={t('barbers.name_label')}
              placeholder={t('barbers.name_placeholder')}
              error={form.formState.errors.name}
              {...form.register('name')}
            />

            <FormTextarea
              label={t('barbers.bio_label')}
              placeholder={t('barbers.bio_placeholder')}
              error={form.formState.errors.bio}
              {...form.register('bio')}
              className="resize-none"
              rows={3}
            />

            <FormInput
              label={t('barbers.image_url_label')}
              placeholder={t('barbers.image_url_placeholder')}
              error={form.formState.errors.image_url}
              {...form.register('image_url')}
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

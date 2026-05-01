import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormValues } from '../hooks/useServices';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea } from '@/components/shared/FormFields';
import { useEffect } from 'react';

interface ServiceFormProps {
  initialValues?: ServiceFormValues;
  onSubmit: (data: ServiceFormValues) => void;
  isPending: boolean;
  title: string;
}

export const ServiceForm = ({ initialValues, onSubmit, isPending, title }: ServiceFormProps) => {
  const { t } = useTranslation();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Card className="max-w-2xl border-border shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label={t('services.name_label')}
              placeholder={t('services.name_placeholder')}
              error={form.formState.errors.name}
              {...form.register('name')}
            />

            <FormTextarea
              label={t('services.description_label')}
              placeholder={t('services.description_placeholder')}
              error={form.formState.errors.description}
              {...form.register('description')}
              className="resize-none"
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label={t('services.duration_label')}
                type="number"
                error={form.formState.errors.duration}
                {...form.register('duration', { valueAsNumber: true })}
              />

              <FormInput
                label={t('services.price_label')}
                type="number"
                error={form.formState.errors.price}
                {...form.register('price', { valueAsNumber: true })}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" asChild disabled={isPending}>
                <Link to="/services">{t('common.cancel')}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

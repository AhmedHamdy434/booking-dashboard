import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormValues, useCreateService } from './hooks/useServices';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea } from '@/components/shared/FormFields';


export const NewServicePage = () => {
  const { t } = useTranslation();
  const { mutate: createService, isPending } = useCreateService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: 0,
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    createService(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{t('services.add_title')}</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('services.details')}</CardTitle>
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

              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to="/services">{t('common.cancel')}</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t('services.creating') : t('services.create')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewServicePage;

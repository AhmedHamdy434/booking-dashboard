import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormValues, useService, useUpdateService } from './hooks/useServices';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const EditServicePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: service, isLoading: isLoadingService } = useService(id);
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration: 30,
      price: 0,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        duration: service.duration,
        price: service.price || 0,
      });
    }
  }, [service, form]);

  const onSubmit = (data: ServiceFormValues) => {
    if (id) {
      updateService({ id, ...data }, {
        onSuccess: () => navigate('/services')
      });
    }
  };

  if (isLoadingService) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('services.edit_title')}</h1>
      </div>

      <Card className="max-w-2xl border-slate-200/60 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle>{t('services.details')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel error={!!form.formState.errors.name}>{t('services.name_label')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('services.name_placeholder')} 
                    {...form.register('name')} 
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel error={!!form.formState.errors.duration}>{t('services.duration_label')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...form.register('duration', { valueAsNumber: true })} 
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.duration?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel error={!!form.formState.errors.price}>{t('services.price_label')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...form.register('price', { valueAsNumber: true })} 
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.price?.message}</FormMessage>
              </FormItem>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" asChild disabled={isUpdating}>
                  <Link to="/services">{t('common.cancel')}</Link>
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? t('services.saving_changes') : t('services.save_changes')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditServicePage;

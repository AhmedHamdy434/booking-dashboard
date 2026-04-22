import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormValues, useCreateService } from './hooks/useServices';
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
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewServicePage = () => {
  const { mutate: createService, isPending } = useCreateService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration: 30,
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
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel error={!!form.formState.errors.name}>Service Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Haircut, Dental Checkup" 
                    {...form.register('name')} 
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel error={!!form.formState.errors.duration}>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...form.register('duration', { valueAsNumber: true })} 
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.duration?.message}</FormMessage>
              </FormItem>

              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to="/services">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create Service'}
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

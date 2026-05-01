import { useMutation, useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/servicesApi';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';

export const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price must be 0 or greater'),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getServices,
  });
};

export const useService = (id: string | undefined) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getServiceById(id!),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
      navigate('/services');
    },
    onError: (error) => {
      toast.error(`Error creating service: ${error.message}`);
    },
  });
};
export const useUpdateService = () => {

  return useMutation({
    mutationFn: servicesApi.updateService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['services', data.id] });
      }
      toast.success('Service updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating service: ${error.message}`);
    },
  });
};

export const useDeleteService = () => {

  return useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.removeQueries({ queryKey: ['services', id] });
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting service: ${error.message}`);
    },
  });
};

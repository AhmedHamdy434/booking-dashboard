import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/servicesApi';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
      navigate('/services');
    },
    onError: (error: any) => {
      toast.error(`Error creating service: ${error.message}`);
    },
  });
};

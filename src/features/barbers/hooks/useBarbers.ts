import { useMutation, useQuery } from '@tanstack/react-query';
import { barbersApi } from '../api/barbersApi';
import { z } from 'zod';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import type { Barber, BarberAvailability } from '@/types/barber';

export const barberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  is_active: z.boolean(),
});

export type BarberFormValues = z.infer<typeof barberSchema>;

export const useBarbers = () => {
  return useQuery({
    queryKey: ['barbers'],
    queryFn: barbersApi.getBarbers,
  });
};

export const useCreateBarber = () => {
  return useMutation({
    mutationFn: barbersApi.createBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] });
      toast.success('Barber created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating barber: ${error.message}`);
    },
  });
};

export const useUpdateBarber = () => {
  return useMutation({
    mutationFn: barbersApi.updateBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] });
      toast.success('Barber updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating barber: ${error.message}`);
    },
  });
};

export const useToggleBarberStatus = () => {
  return useMutation({
    mutationFn: barbersApi.toggleBarberStatus,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['barbers'] });
      const previousBarbers = queryClient.getQueryData<Barber[]>(['barbers']);

      if (previousBarbers) {
        queryClient.setQueryData<Barber[]>(['barbers'], previousBarbers.map(barber => 
          barber.id === variables.id ? { ...barber, is_active: variables.is_active } : barber
        ));
      }
      return { previousBarbers };
    },
    onError: (err, variables, context) => {
      if (context?.previousBarbers) {
        queryClient.setQueryData(['barbers'], context.previousBarbers);
      }
      toast.error(`Error updating status: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] });
    },
  });
};

export const useDeleteBarber = () => {
  return useMutation({
    mutationFn: barbersApi.deleteBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] });
      toast.success('Barber deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting barber: ${error.message}`);
    },
  });
};

export const useBarberAvailability = (barberId: string | undefined) => {
  return useQuery({
    queryKey: ['availability', barberId],
    queryFn: () => barbersApi.getAvailability(barberId!),
    enabled: !!barberId,
  });
};

export const useUpsertAvailability = (barberId: string | undefined) => {
  return useMutation({
    mutationFn: barbersApi.upsertAvailability,
    onSuccess: () => {
      if (barberId) {
        queryClient.invalidateQueries({ queryKey: ['availability', barberId] });
      }
      toast.success('Availability saved successfully');
    },
    onError: (error) => {
      toast.error(`Error saving availability: ${error.message}`);
    },
  });
};

export const useDeleteAvailabilityDay = (barberId: string | undefined) => {
  return useMutation({
    mutationFn: barbersApi.deleteAvailabilityDay,
    onSuccess: () => {
      if (barberId) {
        queryClient.invalidateQueries({ queryKey: ['availability', barberId] });
      }
    },
    onError: (error) => {
      toast.error(`Error deleting availability: ${error.message}`);
    },
  });
};

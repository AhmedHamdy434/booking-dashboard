import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getBookings,
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: bookingsApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking confirmed successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating booking: ${error.message}`);
    },
  });
};

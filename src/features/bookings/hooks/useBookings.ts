import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import type { BookingStatus } from '@/types/booking';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

export const useBookings = (filters?: { status?: string, startDate?: string, endDate?: string, barberId?: string }) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingsApi.getBookings(filters),
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

export const useUpdateBookingStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => 
      bookingsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      const message = variables.status === 'confirmed' ? 'Booking confirmed!' : 'Booking rejected.';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(`Failed to update booking: ${error.message}`);
    },
  });
};

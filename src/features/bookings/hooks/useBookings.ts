import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getBookings,
  });
};

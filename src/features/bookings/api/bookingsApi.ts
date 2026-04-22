import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/booking';

export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (
          name
        )
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
};

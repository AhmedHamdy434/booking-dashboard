import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/booking';

export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (
          name,
          duration
        ),
        barbers (
          name
        )
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'created_at' | 'services' | 'barbers'>): Promise<Booking> => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },
};

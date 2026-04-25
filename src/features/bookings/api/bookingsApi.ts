import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/booking';

export const bookingsApi = {
  getBookings: async (filters?: { status?: string, startDate?: string, endDate?: string, barberId?: string }): Promise<Booking[]> => {
    let query = supabase
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
      `);

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }

    if (filters?.barberId && filters.barberId !== 'all') {
      query = query.eq('barber_id', filters.barberId);
    }

    const { data, error } = await query
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

  updateStatus: async (id: string, status: Booking['status']): Promise<void> => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
  },
};

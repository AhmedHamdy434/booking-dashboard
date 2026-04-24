import { supabase } from '@/lib/supabase';
import type { Barber, CreateBarberDTO, BarberAvailability, UpsertAvailabilityDTO } from '@/types/barber';

export const barbersApi = {
  getBarbers: async (): Promise<Barber[]> => {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },

  createBarber: async (barber: CreateBarberDTO): Promise<Barber> => {
    const { data, error } = await supabase
      .from('barbers')
      .insert([barber])
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  updateBarber: async ({ id, ...barber }: Partial<CreateBarberDTO> & { id: string }): Promise<Barber> => {
    const { data, error } = await supabase
      .from('barbers')
      .update(barber)
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  deleteBarber: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('barbers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  toggleBarberStatus: async ({ id, is_active }: { id: string, is_active: boolean }): Promise<Barber> => {
    const { data, error } = await supabase
      .from('barbers')
      .update({ is_active })
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  getAvailability: async (barberId: string): Promise<BarberAvailability[]> => {
    const { data, error } = await supabase
      .from('barber_availability')
      .select('*')
      .eq('barber_id', barberId)
      .order('day_of_week', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },

  upsertAvailability: async (availabilities: UpsertAvailabilityDTO[]): Promise<void> => {
    if (availabilities.length === 0) return;
    
    // Using upsert on (barber_id, day_of_week) which is a UNIQUE constraint
    const { error } = await supabase
      .from('barber_availability')
      .upsert(availabilities, { onConflict: 'barber_id,day_of_week' });
      
    if (error) throw error;
  },

  deleteAvailabilityDay: async ({ barberId, dayOfWeek }: { barberId: string, dayOfWeek: number }): Promise<void> => {
    const { error } = await supabase
      .from('barber_availability')
      .delete()
      .eq('barber_id', barberId)
      .eq('day_of_week', dayOfWeek);
      
    if (error) throw error;
  }
};

import { supabase } from '@/lib/supabase';
import type { Service, CreateServiceDTO } from '@/types/service';

export const servicesApi = {
  getServices: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },

  createService: async (service: CreateServiceDTO): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
};

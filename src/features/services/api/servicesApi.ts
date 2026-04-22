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

  getServiceById: async (id: string): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  createService: async (service: CreateServiceDTO): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },
  updateService: async ({ id, ...service }: Partial<CreateServiceDTO> & { id: string }): Promise<Service> => {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  deleteService: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },
};

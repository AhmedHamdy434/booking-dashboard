export interface Barber {
  id: string;
  name: string;
  is_active: boolean;
}

export interface CreateBarberDTO {
  name: string;
  is_active?: boolean;
}

export interface BarberAvailability {
  id: string;
  barber_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpsertAvailabilityDTO {
  barber_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

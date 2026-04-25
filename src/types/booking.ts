export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  barber_id: string;
  date: string;
  time: string;
  status: BookingStatus;
  created_at: string;
  // Join fields from services table
  services?: {
    name: string;
    duration: number;
  };
  // Join fields from barbers table
  barbers?: {
    name: string;
  };
}

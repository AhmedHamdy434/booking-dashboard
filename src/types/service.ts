export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

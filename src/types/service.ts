export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface CreateServiceDTO {
  name: string;
  duration: number;
  price: number;
}

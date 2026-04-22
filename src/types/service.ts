export interface Service {
  id: string;
  name: string;
  duration: number;
}

export interface CreateServiceDTO {
  name: string;
  duration: number;
}

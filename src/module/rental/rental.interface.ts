export interface IRentalRequest {
  propertyId: string;
  moveInDate: Date;
  duration: number;
  message?: string;
}
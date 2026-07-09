import { PropertyStatus } from "../../../generated/prisma/enums.js";


export interface IProperty {
  title: string;
  description: string;

  address: string;
  city: string;
  area?: string;

  rentPrice: number;

  bedrooms: number;
  bathrooms: number;

  amenities: string[];
  images: string[];

  categoryId: string;

  status?: PropertyStatus;
}

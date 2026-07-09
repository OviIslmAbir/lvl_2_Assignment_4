import { UserRole } from "../../../generated/prisma/enums.js";


export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;

  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

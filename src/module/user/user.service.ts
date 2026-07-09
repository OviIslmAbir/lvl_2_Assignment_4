import bcrypt from "bcryptjs";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import httpStatus from "http-status";
import jwt, { SignOptions } from "jsonwebtoken"
import { ILoginUser } from "./user.interface.js";
import { UserRole } from "../../../generated/prisma/enums.js"; 

const registerUserFromDB = async (payload: any) => {
    const { name, email, password, role } = payload;

    if (role === UserRole.ADMIN || role === "ADMIN") {
        const error: any = new Error("You cannot register as an ADMIN through this route.");
        error.statusCode = httpStatus.FORBIDDEN; 
        throw error;
    }


    if (role !== UserRole.TENANT && role !== UserRole.LANDLORD) {
        const error: any = new Error("Invalid role. Role must be either TENANT or LANDLORD.");
        error.statusCode = httpStatus.BAD_REQUEST; 
        throw error;
    }

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        const error: any = new Error("User with this email already exists.");
        error.statusCode = httpStatus.CONFLICT; 
        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
    );

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role, 
        }
    });

    const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
        omit: { password: true }
    });

    return user;
};

const loginUserFromDB = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.status === "BANNED") {
        throw new Error("Your account has been banned.");
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    const JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(
        JwtPayload,
        config.jwt_access_secret,
        {
            expiresIn: config.jwt_access_expires_in,
        } as SignOptions
    );

    return {
        accessToken,
    };
};
const updateProfileInDB = async (id: string, payload: any) => {

    const { name, phone, address, profileImage } = payload;

    await prisma.user.findUniqueOrThrow({
        where: { id },
    });


    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name,
            phone,
            address,
            profileImage
        },
        omit: {
            password: true 
        }
    });

    return updatedUser;
};

const getMeFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
    registerUserFromDB,
    loginUserFromDB,
    getMeFromDB,
    updateProfileInDB
};

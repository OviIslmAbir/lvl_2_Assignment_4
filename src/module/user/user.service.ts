import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import jwt, { SignOptions } from "jsonwebtoken"
import { ILoginUser } from "./user.interface";
const registerUserFromDB = async (payload: any) => {

    const {
        name,
        email,
        password,
        role,
        phone,
        address,
        profileImage
    } = payload;

    const isUserExists = await prisma.user.findUnique({
    where: {
        email,
    },
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
            phone,
            address,
            profileImage
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id
        },
        omit: {
            password: true
        }
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
    getMeFromDB
};
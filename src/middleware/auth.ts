import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
    
import config from "../config";
import { prisma } from "../lib/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/browser";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.accessToken ??
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : undefined);

      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "You are not authorized. Please login first.",
          errorDetails: null,
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { id } = decoded;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found.",
          errorDetails: null,
        });
      }

      if (user.status === UserStatus.BANNED) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been banned.",
          errorDetails: null,
        });
      }

      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(user.role)
      ) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Forbidden. You don't have permission to access this resource.",
          errorDetails: null,
        });
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error: any) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired token.",
        errorDetails: error.message,
      });
    }
  };
};
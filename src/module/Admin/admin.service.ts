import httpStatus from "http-status";

import ApiError from "../../error/apiError.js";
import { prisma } from "../../lib/prisma.js";
import { UserStatus } from "../../../generated/prisma/enums.js";

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatusFromDB = async (
  id: string,
  status: UserStatus
) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });
};

const getAllPropertiesFromDB = async () => {
  return await prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusFromDB,
  getAllPropertiesFromDB,
};

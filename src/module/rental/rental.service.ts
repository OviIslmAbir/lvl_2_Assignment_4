 import httpStatus from "http-status";
import ApiError from "../../error/apiError";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";
import { RentalStatus } from "../../../generated/prisma/client";

const createRentalRequestFromDB = async (
  payload: IRentalRequest,
  tenantId: string
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: [RentalStatus.PENDING, RentalStatus.APPROVED],
      },
    },
  });

  if (existingRequest) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already requested this property"
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      ...payload,
    },
    include: {
      property: true,
    },
  });

  return result;
};

const getMyRentalRequestsFromDB = async (tenantId: string) => {
  return await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleRentalRequestFromDB = async (
  id: string,
  tenantId: string
) => {
  const result = await prisma.rentalRequest.findFirst({
    where: {
      id,
      tenantId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  return result;
};

export const rentalService = {
  createRentalRequestFromDB,
  getMyRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
};
import httpStatus from "http-status";
import ApiError from "../../error/apiError";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";
import {
  RentalStatus,
  PropertyStatus,
} from "../../../generated/prisma/client";

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


  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This property is not available for rent."
    );
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
      "You have already submitted a rental request for this property."
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate: payload.moveInDate,
      duration: payload.duration,
      message: payload.message,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
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
      property: {
        include: {
          category: true,
        },
      },
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
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  return result;
};
const getLandlordRequestsFromDB = async (landlordId: string) => {
  return await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateRentalRequestStatusFromDB = async (
  rentalId: string,
  landlordId: string,
  status: RentalStatus
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Rental request not found"
    );
  }

  if (rental.property.landlordId !== landlordId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this rental request"
    );
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rental request has already been processed"
    );
  }

  const result = await prisma.rentalRequest.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
    include: {
      tenant: true,
      property: true,
    },
  });

  if (status === RentalStatus.APPROVED) {
    await prisma.property.update({
      where: {
        id: rental.propertyId,
      },
      data: {
        status: PropertyStatus.UNAVAILABLE,
      },
    });
  }

  return result;
};

export const rentalService = {
  createRentalRequestFromDB,
  getMyRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
  getLandlordRequestsFromDB,
  updateRentalRequestStatusFromDB,
};
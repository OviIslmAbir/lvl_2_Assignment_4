import httpStatus from "http-status";
import ApiError from "../../error/apiError.js";
import { prisma } from "../../lib/prisma.js";
import { IReview } from "./review.interface.js";

const createReviewFromDB = async (
  payload: IReview,
  tenantId: string
) => {
  const { propertyId, rating, comment } = payload;

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const rental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: "APPROVED",
      payment: {
        status: "COMPLETED",
      },
    },
  });

  if (!rental) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can review only after completing payment."
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
    },
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already reviewed this property."
    );
  }

  const result = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      property: true,
    },
  });

  return result;
};

export const reviewService = {
  createReviewFromDB,
};

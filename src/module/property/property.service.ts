import { Prisma, PropertyStatus } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import ApiError from "../../error/apiError";

const createPropertyFromDB = async (payload: any, landlordId: string) => {
  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });
  return result;
};

const getAllPropertiesFromDB = async (query: Record<string, any>) => {
  const { location, minPrice, maxPrice, type, page = 1, limit = 10 } = query;

  const andConditions: Prisma.PropertyWhereInput[] = [
    { status: PropertyStatus.AVAILABLE },
  ];

  if (location) {
    andConditions.push({
      OR: [
        { city: { contains: location, mode: "insensitive" } },
        { area: { contains: location, mode: "insensitive" } },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      rentPrice: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  if (type) {
    andConditions.push({
      category: { name: { equals: type, mode: "insensitive" } },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = { AND: andConditions };

  const skip = (Number(page) - 1) * Number(limit);

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, phone: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.property.count({ where: whereConditions });

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data: result,
  };
};

const getSinglePropertyFromDB = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, phone: true, email: true },
      },
      reviews: {
        include: { tenant: { select: { id: true, name: true } } },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  return result;
};

const updatePropertyFromDB = async (
  id: string,
  landlordId: string,
  payload: any
) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this property"
    );
  }

  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deletePropertyFromDB = async (id: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this property"
    );
  }

  const result = await prisma.property.delete({ where: { id } });
  return result;
};

export const propertyService = {
  createPropertyFromDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromDB,
  updatePropertyFromDB,
  deletePropertyFromDB,
};
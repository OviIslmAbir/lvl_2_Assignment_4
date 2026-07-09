import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import ApiError from "../../error/apiError.js";
import { ICategory } from "./category.interface.js";

const createCategoryFromDB = async (payload: ICategory) => {
  const isExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, "Category already exists");
  }

  return await prisma.category.create({
    data: payload,
  });
};

const getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const categoryService = {
  createCategoryFromDB,
  getAllCategoriesFromDB,
};

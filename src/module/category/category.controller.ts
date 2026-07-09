import { Request, Response } from "express";
import httpStatus from "http-status";
import { categoryService } from "./category.service.js";

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategoryFromDB(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategoriesFromDB();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};



export const categoryController = {
  createCategory,
  getAllCategories,
};

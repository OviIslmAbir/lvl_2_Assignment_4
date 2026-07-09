import { Request, Response } from "express";
import httpStatus from "http-status";
import { adminService } from "./admin.service.js";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUsersFromDB();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Users retrieved successfully",
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

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const result = await adminService.updateUserStatusFromDB(
      req.params.id as string,
      req.body.status
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "User status updated successfully",
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

const getAllProperties = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllPropertiesFromDB();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Properties retrieved successfully",
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

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
};

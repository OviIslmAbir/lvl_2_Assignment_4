import { Request, Response } from "express";
import httpStatus from "http-status";
import { propertyService } from "./property.service";


const getIdParam = (req: Request): string => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    throw {
      statusCode: httpStatus.BAD_REQUEST,
      message: "Valid property id is required",
    };
  }
  return id;
};

const createProperty = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.createPropertyFromDB(
      req.body,
      req.user!.id
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Property created successfully",
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
    const result = await propertyService.getAllPropertiesFromDB(req.query);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Properties retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const getSingleProperty = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const result = await propertyService.getSinglePropertyFromDB(id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property retrieved successfully",
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

const updateProperty = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const result = await propertyService.updatePropertyFromDB(
      id,
      req.user!.id,
      req.body
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property updated successfully",
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

const deleteProperty = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const result = await propertyService.deletePropertyFromDB(id, req.user!.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property deleted successfully",
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

export const propertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};
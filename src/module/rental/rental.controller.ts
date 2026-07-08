import { Request, Response } from "express";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";

const createRentalRequest = async (req: Request, res: Response) => {
  try {
    const result = await rentalService.createRentalRequestFromDB(
      req.body,
      req.user!.id
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Rental request submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const getMyRentalRequests = async (req: Request, res: Response) => {
  try {
    const result = await rentalService.getMyRentalRequestsFromDB(req.user!.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const getSingleRentalRequest = async (req: Request, res: Response) => {
  try {
    const result = await rentalService.getSingleRentalRequestFromDB(
      req.params.id as string,
      req.user!.id
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Rental request retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};
const getLandlordRequests = async (req: Request, res: Response) => {
  try {
    const result = await rentalService.getLandlordRequestsFromDB(
      req.user!.id
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const updateRentalRequestStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await rentalService.updateRentalRequestStatusFromDB(
        req.params.id as string,
        req.user!.id,
        req.body.status
      );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Rental request updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRequests,
  updateRentalRequestStatus,
};
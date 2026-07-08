import { Request, Response } from "express";
import httpStatus from "http-status";
import { landlordService } from "./landlord.service";

const getLandlordReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await landlordService.getLandlordReviewsFromDB(
      req.user!.id
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Reviews retrieved successfully",
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
export const landlordController = {
  getLandlordReviews,
};

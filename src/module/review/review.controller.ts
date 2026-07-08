import { Request, Response } from "express";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await reviewService.createReviewFromDB(
      req.body,
      req.user!.id
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Review created successfully",
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

export const reviewController = {
  createReview,
};
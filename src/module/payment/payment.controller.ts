import { Request, Response } from "express";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await paymentService.createPaymentSessionFromDB(
      req.body,
      req.user!.id
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Checkout session created successfully",
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

const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    const signature = req.headers["stripe-signature"] as string;

    const result = await paymentService.stripeWebhookFromDB(
      req.body,
      signature
    );

    res.status(httpStatus.OK).json(result);
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
      errorDetails: error.message,
    });
  }
};

const getMyPayments = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await paymentService.getMyPaymentsFromDB(req.user!.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payments retrieved successfully",
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

const getSinglePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await paymentService.getSinglePaymentFromDB(
      req.params.id as string,
      req.user!.id
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment retrieved successfully",
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

export const paymentController = {
  createPayment,
  stripeWebhook,
  getMyPayments,
  getSinglePayment,
};
import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUserFromDB(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
      errorDetails: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUserFromDB(req.body);

    const { accessToken } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 
    })

    res.status(httpStatus.OK).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken
      }
    });

  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
      errorDetails: error.message,
    });
  }
};
const getMe = async (req: Request, res: Response) => {
  try {
    const result = await userService.getMeFromDB(req.user!.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "User retrieved successfully",
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

export const userController = {
  registerUser,
  loginUser,
    getMe
};
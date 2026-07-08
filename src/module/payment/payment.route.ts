import express from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.TENANT),
  paymentController.createPayment
);

export const paymentRoutes = router;
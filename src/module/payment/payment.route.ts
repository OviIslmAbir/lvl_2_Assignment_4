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

router.post(
  "/confirm",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

router.get(
  "/",
  auth(UserRole.TENANT),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  auth(UserRole.TENANT),
  paymentController.getSinglePayment
);

export const paymentRoutes = router;
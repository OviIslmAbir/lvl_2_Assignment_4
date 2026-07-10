import express from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middleware/auth.js";
import { paymentController } from "./payment.controller.js";

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


router.get("/payment-success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment completed successfully.",
    paymentId: req.query.paymentId,
  });
});

router.get("/payment-cancel", (req, res) => {
  res.status(200).json({
    success: false,
    message: "Payment cancelled.",
  });
});

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
import express from "express";
import { rentalController } from "./rental.controller";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  rentalController.createRentalRequest
);

router.get(
  "/",
  auth(UserRole.TENANT),
  rentalController.getMyRentalRequests
);

router.get(
  "/:id",
  auth(UserRole.TENANT),
  rentalController.getSingleRentalRequest
);

export const rentalRoutes = router;
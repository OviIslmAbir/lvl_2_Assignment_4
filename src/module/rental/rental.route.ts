import express from "express";
import { rentalController } from "./rental.controller.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middleware/auth.js";

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

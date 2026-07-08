import express from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  reviewController.createReview
);

export const reviewRoutes = router;
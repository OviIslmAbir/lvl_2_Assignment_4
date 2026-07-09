import express from "express";
import { reviewController } from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";


const router = express.Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  reviewController.createReview
);

export const reviewRoutes = router;

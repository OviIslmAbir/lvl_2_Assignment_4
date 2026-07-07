import express from "express";
import { adminController } from "./admin.controller";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";

const router = express.Router();
router.get(
  "/users",
  auth(UserRole.ADMIN),
  adminController.getAllUsers
);

router.patch(
  "/users/:id",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus
);

router.get(
  "/properties",
  auth(UserRole.ADMIN),
  adminController.getAllProperties
);

export const adminRoutes = router;
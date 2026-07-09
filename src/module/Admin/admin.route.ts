import express from "express";
import { adminController } from "./admin.controller.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middleware/auth.js";

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

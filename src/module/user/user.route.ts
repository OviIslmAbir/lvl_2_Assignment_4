import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/me", auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT), userController.getMe);
router.put(
  "/update-profile", 
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT), 
  userController.updateProfile
);

export const userRoute = router;
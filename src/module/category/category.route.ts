import express from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";


const router = express.Router();


router.get("/", categoryController.getAllCategories);


router.post(
  "/",
  auth(UserRole.ADMIN),
  categoryController.createCategory
);


export const categoryRoutes = router;

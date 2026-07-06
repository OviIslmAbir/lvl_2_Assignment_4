import express from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";


const router = express.Router();


router.get("/", categoryController.getAllCategories);


router.post(
  "/",
  auth(UserRole.ADMIN),
  categoryController.createCategory
);


export const categoryRoutes = router;
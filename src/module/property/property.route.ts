import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";
import { propertyController } from "./property.controller";

const router = Router()

router.get("/", propertyController.getAllProperties);

router.get("/:id", propertyController.getSingleProperty);

router.post(
  "/landlord/properties",
  auth(UserRole.LANDLORD),
  propertyController.createProperty
);

router.put(
  "/landlord/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.updateProperty
);

router.delete(
  "/landlord/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty
);

export const propertiesRoute = router;
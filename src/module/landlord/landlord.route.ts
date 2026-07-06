// landlord.route.ts (landlord only)
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";
import { propertyController } from "../property/property.controller";


const router = Router();

router.post(
  "/properties",
  auth(UserRole.LANDLORD),
  propertyController.createProperty
);

router.put(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.updateProperty
);

router.delete(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty
);

export const landlordRoute = router;
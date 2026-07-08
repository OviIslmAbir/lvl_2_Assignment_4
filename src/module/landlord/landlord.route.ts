// landlord.route.ts (landlord only)
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";
import { propertyController } from "../property/property.controller";
import { rentalController } from "../rental/rental.controller";


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
router.get(
  "/requests",
  auth(UserRole.LANDLORD),
  rentalController.getLandlordRequests
);

router.patch(
  "/requests/:id",
  auth(UserRole.LANDLORD),
  rentalController.updateRentalRequestStatus
);

export const landlordRoute = router;
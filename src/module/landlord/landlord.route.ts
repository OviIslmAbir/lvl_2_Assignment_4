// landlord.route.ts (landlord only)
import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { propertyController } from "../property/property.controller.js";
import { rentalController } from "../rental/rental.controller.js";
import { landlordController } from "./landlord.controller.js";


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

router.get(
  "/reviews",
  auth(UserRole.LANDLORD),
  landlordController.getLandlordReviews
);


export const landlordRoute = router;

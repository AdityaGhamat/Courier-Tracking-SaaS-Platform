import { Router } from "express";
import { hubController } from "../hub.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createHubSchema,
  updateHubSchema,
  assignShipmentToHubSchema,
} from "../validation/hub.validation";

const router = Router();

router.use(AuthMiddleware);
router.use(requireRole(["admin"]));

// =======================
// HUB CRUD
// =======================

router.post("/", validate(createHubSchema), hubController.createHub);

router.get("/", hubController.listHubs);

router.get("/:id", hubController.getHubById);

router.patch("/:id", validate(updateHubSchema), hubController.updateHub);

router.delete("/:id", hubController.deleteHub);

// =======================
// SHIPMENT ASSIGNMENT
// =======================

router.post(
  "/:id/assign-shipment",
  validate(assignShipmentToHubSchema),
  hubController.assignShipmentToHub,
);

router.get("/:id/shipments", hubController.getHubShipments);

export default router;

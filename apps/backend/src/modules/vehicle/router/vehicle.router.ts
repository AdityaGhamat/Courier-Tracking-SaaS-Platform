import { Router } from "express";
import { vehicleController } from "../vehicle.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createVehicleSchema,
  updateVehicleSchema,
  assignAgentToVehicleSchema,
} from "../validation/vehicle.validation";

const router = Router();

router.use(AuthMiddleware);

// =======================
// AGENT ROUTE
// =======================

router.get(
  "/my/vehicle",
  requireRole(["delivery_agent"]),
  vehicleController.getMyVehicle,
);

// =======================
// ADMIN ROUTES
// =======================

router.post(
  "/",
  requireRole(["admin"]),
  validate(createVehicleSchema),
  vehicleController.createVehicle,
);

router.get("/", requireRole(["admin"]), vehicleController.listVehicles);

router.get("/:id", requireRole(["admin"]), vehicleController.getVehicleById);

router.patch(
  "/:id",
  requireRole(["admin"]),
  validate(updateVehicleSchema),
  vehicleController.updateVehicle,
);

router.delete("/:id", requireRole(["admin"]), vehicleController.deleteVehicle);

router.post(
  "/:id/assign-agent",
  requireRole(["admin"]),
  validate(assignAgentToVehicleSchema),
  vehicleController.assignAgentToVehicle,
);

router.delete(
  "/:id/unassign-agent",
  requireRole(["admin"]),
  vehicleController.unassignAgent,
);

export default router;

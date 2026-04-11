import { Router } from "express";
import { shipmentController } from "../shipment.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createShipmentSchema,
  updateShipmentStatusSchema,
  assignAgentSchema,
  listShipmentsQuerySchema,
} from "../validation/shipment.validation";

const router = Router();

// All shipment routes require authentication
router.use(AuthMiddleware);

// =======================
// ADMIN ROUTES
// =======================

router.post(
  "/",
  requireRole(["admin", "customer"]),
  validate(createShipmentSchema),
  shipmentController.createShipment,
);

router.get(
  "/",
  requireRole(["admin"]),
  validate(listShipmentsQuerySchema, "query"),
  shipmentController.listShipments,
);

router.get(
  "/my/shipments",
  requireRole(["customer"]),
  validate(listShipmentsQuerySchema, "query"),
  shipmentController.getMyShipments,
);

router.get(
  "/agent/assigned",
  requireRole(["delivery_agent"]),
  shipmentController.getAgentShipments,
);

router.get(
  "/:id",
  requireRole(["admin", "delivery_agent"]),
  shipmentController.getShipmentById,
);

router.post(
  "/:id/status",
  requireRole(["admin", "delivery_agent"]),
  validate(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus,
);

router.post(
  "/:id/assign-agent",
  requireRole(["admin"]),
  validate(assignAgentSchema),
  shipmentController.assignAgent,
);

export default router;

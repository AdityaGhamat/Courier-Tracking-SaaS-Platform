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

router.use(AuthMiddleware);

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipmentInput'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  requireRole(["admin", "customer"]),
  validate(createShipmentSchema),
  shipmentController.createShipment,
);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: List all shipments (admin only)
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [label_created, in_transit, out_for_delivery, delivered, failed]
 *     responses:
 *       200:
 *         description: Shipments fetched successfully
 */
router.get(
  "/",
  requireRole(["admin"]),
  validate(listShipmentsQuerySchema, "query"),
  shipmentController.listShipments,
);

/**
 * @swagger
 * /api/shipments/my/shipments:
 *   get:
 *     summary: Get current customer's shipments
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Shipments fetched successfully
 */
router.get(
  "/my/shipments",
  requireRole(["customer"]),
  validate(listShipmentsQuerySchema, "query"),
  shipmentController.getMyShipments,
);

/**
 * @swagger
 * /api/shipments/agent/assigned:
 *   get:
 *     summary: Get shipments assigned to current agent
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Agent shipments fetched successfully
 */
router.get(
  "/agent/assigned",
  requireRole(["delivery_agent"]),
  shipmentController.getAgentShipments,
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Shipment fetched successfully
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:id",
  requireRole(["admin", "delivery_agent"]),
  shipmentController.getShipmentById,
);

/**
 * @swagger
 * /api/shipments/{id}/status:
 *   post:
 *     summary: Update shipment status
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShipmentStatusInput'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/:id/status",
  requireRole(["admin", "delivery_agent"]),
  validate(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus,
);

/**
 * @swagger
 * /api/shipments/{id}/assign-agent:
 *   post:
 *     summary: Assign delivery agent to shipment (admin only)
 *     tags: [Shipments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignAgentInput'
 *     responses:
 *       200:
 *         description: Agent assigned successfully
 */
router.post(
  "/:id/assign-agent",
  requireRole(["admin"]),
  validate(assignAgentSchema),
  shipmentController.assignAgent,
);

export default router;

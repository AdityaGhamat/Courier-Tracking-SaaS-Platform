import { Router } from "express";
import { hubController } from "../hub.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createHubSchema,
  updateHubSchema,
  assignHubSchema,
} from "../validation/hub.validation";

const router = Router();

router.use(AuthMiddleware);
router.use(requireRole(["admin"]));

/**
 * @swagger
 * /api/hubs:
 *   post:
 *     summary: Create a new hub (admin only)
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, city, country]
 *             properties:
 *               name: { type: string, example: Mumbai Central Hub }
 *               address: { type: string, example: 123 Logistics Park }
 *               city: { type: string, example: Mumbai }
 *               state: { type: string, example: Maharashtra }
 *               country: { type: string, example: India }
 *               phone: { type: string, example: "+919876543210" }
 *     responses:
 *       201:
 *         description: Hub created successfully
 */
router.post("/", validate(createHubSchema), hubController.createHub);

/**
 * @swagger
 * /api/hubs:
 *   get:
 *     summary: List all hubs (admin only)
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Hubs fetched successfully
 */
router.get("/", hubController.listHubs);

// ✅ Specific static routes BEFORE dynamic /:id routes

/**
 * @swagger
 * /api/hubs/shipments/{id}/assign:
 *   post:
 *     summary: Assign a shipment to a hub
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hubId]
 *             properties:
 *               hubId: { type: string, example: uuid-of-hub }
 *     responses:
 *       200:
 *         description: Shipment assigned to hub
 */
router.post(
  "/shipments/:id/assign",
  validate(assignHubSchema),
  hubController.assignShipmentToHub,
);

// ✅ Dynamic /:id routes AFTER static routes

/**
 * @swagger
 * /api/hubs/{id}/shipments:
 *   get:
 *     summary: Get all shipments in a hub
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hub shipments fetched
 */
router.get("/:id/shipments", hubController.getHubShipments);

/**
 * @swagger
 * /api/hubs/{id}:
 *   get:
 *     summary: Get hub by ID
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hub fetched successfully
 *       404:
 *         description: Hub not found
 */
router.get("/:id", hubController.getHubById);

/**
 * @swagger
 * /api/hubs/{id}:
 *   patch:
 *     summary: Update hub details
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hub updated successfully
 */
router.patch("/:id", validate(updateHubSchema), hubController.updateHub);

/**
 * @swagger
 * /api/hubs/{id}:
 *   delete:
 *     summary: Deactivate a hub
 *     tags: [Hubs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hub deactivated successfully
 */
router.delete("/:id", hubController.deleteHub);

export default router;

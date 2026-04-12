import { Router } from "express";
import { trackingController } from "../tracking.controller";
import { validate } from "../../auth/middleware/validation.middleware";
import { trackingParamsSchema } from "../validation/tracking.validation";

const router = Router();

/**
 * @swagger
 * /api/track/{trackingNumber}:
 *   get:
 *     summary: Track a shipment by tracking number (public)
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema: { type: string }
 *         example: CN-20260412-AB3X
 *     responses:
 *       200:
 *         description: Shipment tracked successfully
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:trackingNumber",
  validate(trackingParamsSchema, "params"),
  trackingController.trackShipment,
);

export default router;
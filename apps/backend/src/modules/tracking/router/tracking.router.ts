import { Router } from "express";
import { trackingController } from "../tracking.controller";
import { validate } from "../../auth/middleware/validation.middleware";
import { trackingParamsSchema } from "../validation/tracking.validation";

const router = Router();

// =======================
// PUBLIC ROUTE — No auth required
// =======================

router.get(
  "/:trackingNumber",
  validate(trackingParamsSchema, "params"),
  trackingController.trackShipment,
);

export default router;

import { Router } from "express";
import { paymentController } from "../payment.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
  listPaymentsQuerySchema,
} from "../validation/payment.validation";

const router = Router();

router.use(AuthMiddleware);

// =======================
// CUSTOMER ROUTES
// must come before /:id to avoid conflicts
// =======================

router.get(
  "/my/:parcelId/history",
  requireRole(["customer"]),
  paymentController.getMyPayments,
);

router.get(
  "/my/:parcelId",
  requireRole(["customer"]),
  paymentController.getMyActivePayment,
);

// =======================
// ADMIN ROUTES
// =======================

router.post(
  "/",
  requireRole(["admin"]),
  validate(createPaymentSchema),
  paymentController.createPayment,
);

router.get(
  "/",
  requireRole(["admin"]),
  validate(listPaymentsQuerySchema, "query"),
  paymentController.listPayments,
);

router.get(
  "/parcel/:parcelId/history",
  requireRole(["admin"]),
  paymentController.getPaymentsByParcelId,
);

router.get(
  "/parcel/:parcelId",
  requireRole(["admin"]),
  paymentController.getActivePaymentByParcelId,
);

router.get("/:id", requireRole(["admin"]), paymentController.getPaymentById);

router.patch(
  "/:id/status",
  requireRole(["admin"]),
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus,
);

export default router;

import { Router } from "express";
import { superAdminController } from "../superAdmin.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createPlanSchema,
  updatePlanSchema,
  assignPlanSchema,
} from "../validation/superAdmin.validation";

const router = Router();

router.use(AuthMiddleware);
router.use(requireRole(["super_admin"]));

// =======================
// TENANT MANAGEMENT
// =======================

router.get("/tenants", superAdminController.listAllTenants);
router.get("/tenants/:id", superAdminController.getTenantById);
router.delete("/tenants/:id", superAdminController.deleteTenant);
router.get(
  "/tenants/:id/subscription",
  superAdminController.getTenantSubscription,
);

// =======================
// SUBSCRIPTION PLANS
// =======================

router.post(
  "/plans",
  validate(createPlanSchema),
  superAdminController.createPlan,
);

router.get("/plans", superAdminController.listPlans);

router.patch(
  "/plans/:id",
  validate(updatePlanSchema),
  superAdminController.updatePlan,
);

router.delete("/plans/:id", superAdminController.deletePlan);

// =======================
// ASSIGN PLAN TO TENANT
// =======================

router.post(
  "/subscriptions/assign",
  validate(assignPlanSchema),
  superAdminController.assignPlanToTenant,
);

export default router;

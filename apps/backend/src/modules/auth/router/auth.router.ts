import { Router } from "express";
import { authController } from "../auth.controller";
import { validate } from "../middleware/validation.middleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

import {
  registerTenantAdminSchema,
  loginSchema,
  registerAgentSchema,
  registerCustomerSchema,
} from "../validation/auth.validation";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================

router.post(
  "/register-tenant",
  validate(registerTenantAdminSchema),
  authController.registerTenant,
);
router.post(
  "/register-customer",
  validate(registerCustomerSchema),
  authController.registerCustomer,
);

router.post("/login", validate(loginSchema), authController.login);

// =======================
// PROTECTED ROUTES
// =======================

router.post(
  "/register-agent",
  AuthMiddleware,
  requireRole(["admin"]),
  validate(registerAgentSchema),
  authController.registerAgent,
);

router.post("/logout", authController.logout);

export default router;

import { Router } from "express";
import { authController } from "../auth.controller";
import { validate } from "../middleware/validation.middleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { authRateLimit } from "../../core/middlewares/rateLimit.middlewares";
import {
  registerTenantAdminSchema,
  loginSchema,
  registerAgentSchema,
  registerCustomerSchema,
  registerSuperAdminSchema,
} from "../validation/auth.validation";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================

router.post(
  "/register-tenant",
  authRateLimit,
  validate(registerTenantAdminSchema),
  authController.registerTenant,
);
router.post(
  "/register-customer",
  authRateLimit,
  validate(registerCustomerSchema),
  authController.registerCustomer,
);

router.post(
  "/login",
  authRateLimit,
  validate(loginSchema),
  authController.login,
);

// =======================
// PROTECTED ROUTES
// =======================

router.post(
  "/register-agent",
  AuthMiddleware,
  requireRole(["admin"]),
  authRateLimit,
  validate(registerAgentSchema),
  authController.registerAgent,
);

router.post(
  "/register/super-admin",
  authRateLimit,
  validate(registerSuperAdminSchema),
  authController.registerSuperAdmin,
);

router.post("/logout", authController.logout);

export default router;

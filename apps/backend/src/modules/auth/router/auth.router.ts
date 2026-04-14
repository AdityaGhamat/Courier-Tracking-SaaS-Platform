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

/**
 * @swagger
 * /api/auth/register-tenant:
 *   post:
 *     summary: Register a new tenant (admin + workspace)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterTenantInput'
 *     responses:
 *       201:
 *         description: Tenant registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/register-tenant",
  authRateLimit,
  validate(registerTenantAdminSchema),
  authController.registerTenant,
);

/**
 * @swagger
 * /api/auth/register-customer:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Jane Doe }
 *               email: { type: string, example: jane@example.com }
 *               password: { type: string, example: StrongPass123! }
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/register-customer",
  authRateLimit,
  validate(registerCustomerSchema),
  authController.registerCustomer,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  authRateLimit,
  validate(loginSchema),
  authController.login,
);

// =======================
// PROTECTED ROUTES
// =======================

/**
 * @swagger
 * /api/auth/register-agent:
 *   post:
 *     summary: Register a delivery agent (admin only)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Agent Smith }
 *               email: { type: string, example: agent@example.com }
 *               password: { type: string, example: StrongPass123! }
 *     responses:
 *       201:
 *         description: Agent registered successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/register-agent",
  AuthMiddleware,
  requireRole(["admin"]),
  authRateLimit,
  validate(registerAgentSchema),
  authController.registerAgent,
);

/**
 * @swagger
 * /api/auth/register/super-admin:
 *   post:
 *     summary: Register a super admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Super Admin }
 *               email: { type: string, example: superadmin@example.com }
 *               password: { type: string, example: StrongPass123! }
 *     responses:
 *       201:
 *         description: Super Admin registered successfully
 */
router.post(
  "/register/super-admin",
  authRateLimit,
  validate(registerSuperAdminSchema),
  authController.registerSuperAdmin,
);

router.post("/refresh-session", authController.refreshSession);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Returns current user from JWT
 *       401:
 *         description: Not authenticated
 */
router.get("/me", AuthMiddleware, authController.me);

router.post(
  "/register-agent",
  AuthMiddleware,
  requireRole(["admin"]),
  authRateLimit,
  validate(registerAgentSchema),
  authController.registerAgent,
);

export default router;

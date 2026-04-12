import { Router } from "express";
import { subscriptionController } from "../subscription.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { validate } from "../../auth/middleware/validation.middleware";
import {
  createPlanSchema,
  updatePlanSchema,
  assignPlanSchema,
  updateSubscriptionSchema,
} from "../validation/subscription.validation";

const router = Router();

router.use(AuthMiddleware);

// =====================
// Static routes FIRST
// =====================

/**
 * @swagger
 * /api/subscriptions/plans:
 *   get:
 *     summary: List all active plans
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 */
router.get("/plans", subscriptionController.listPlans);

/**
 * @swagger
 * /api/subscriptions/plans:
 *   post:
 *     summary: Create a new plan (super_admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, price, billingCycle, maxShipments, maxAgents]
 *             properties:
 *               name: { type: string, example: Pro Plan }
 *               description: { type: string, example: Best for growing teams }
 *               type: { type: string, enum: [basic, pro, enterprise] }
 *               price: { type: number, example: 49.99 }
 *               billingCycle: { type: string, enum: [monthly, yearly] }
 *               maxShipments: { type: integer, example: 1000 }
 *               maxAgents: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
router.post(
  "/plans",
  requireRole(["super_admin"]),
  validate(createPlanSchema),
  subscriptionController.createPlan,
);

/**
 * @swagger
 * /api/subscriptions/assign:
 *   post:
 *     summary: Assign a plan to a workspace (super_admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workspaceId, planId, endDate]
 *             properties:
 *               workspaceId: { type: string }
 *               planId: { type: string }
 *               endDate: { type: string, example: "2027-04-12T00:00:00.000Z" }
 *     responses:
 *       201:
 *         description: Plan assigned successfully
 */
router.post(
  "/assign",
  requireRole(["super_admin"]),
  validate(assignPlanSchema),
  subscriptionController.assignPlan,
);

/**
 * @swagger
 * /api/subscriptions/my:
 *   get:
 *     summary: Get current workspace subscription (admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Subscription fetched
 */
router.get(
  "/my",
  requireRole(["admin"]),
  subscriptionController.getMySubscription,
);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: List all subscriptions (super_admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Subscriptions fetched
 */
router.get(
  "/",
  requireRole(["super_admin"]),
  subscriptionController.listAllSubscriptions,
);

// =====================
// Dynamic /:id routes LAST
// =====================

/**
 * @swagger
 * /api/subscriptions/plans/{id}:
 *   get:
 *     summary: Get plan by ID
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan fetched
 */
router.get("/plans/:id", subscriptionController.getPlanById);

/**
 * @swagger
 * /api/subscriptions/plans/{id}:
 *   patch:
 *     summary: Update a plan (super_admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan updated
 */
router.patch(
  "/plans/:id",
  requireRole(["super_admin"]),
  validate(updatePlanSchema),
  subscriptionController.updatePlan,
);

/**
 * @swagger
 * /api/subscriptions/plans/{id}:
 *   delete:
 *     summary: Deactivate a plan (super_admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan deactivated
 */
router.delete(
  "/plans/:id",
  requireRole(["super_admin"]),
  subscriptionController.deletePlan,
);

/**
 * @swagger
 * /api/subscriptions/{id}/status:
 *   patch:
 *     summary: Update subscription status (super_admin only)
 *     tags: [Subscriptions]
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
  "/:id/status",
  requireRole(["super_admin"]),
  validate(updateSubscriptionSchema),
  subscriptionController.updateSubscriptionStatus,
);

export default router;

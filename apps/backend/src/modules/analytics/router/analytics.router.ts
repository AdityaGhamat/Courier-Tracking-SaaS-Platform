import { Router } from "express";
import { analyticsController } from "../analytics.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";

const router = Router();

router.use(AuthMiddleware);

/**
 * @swagger
 * /api/analytics/workspace:
 *   get:
 *     summary: Get workspace analytics (admin only)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Workspace analytics fetched
 *       403:
 *         description: Forbidden
 */
router.get(
  "/workspace",
  requireRole(["admin"]),
  analyticsController.getWorkspaceAnalytics,
);

/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get platform-wide analytics (super_admin only)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics fetched
 *       403:
 *         description: Forbidden
 */
router.get(
  "/platform",
  requireRole(["super_admin"]),
  analyticsController.getPlatformAnalytics,
);

/**
 * @swagger
 * /api/analytics/agent:
 *   get:
 *     summary: Get agent personal analytics (delivery_agent only)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Agent analytics fetched
 *       403:
 *         description: Forbidden
 */
router.get(
  "/agent",
  requireRole(["delivery_agent"]),
  analyticsController.getAgentAnalytics,
);

export default router;

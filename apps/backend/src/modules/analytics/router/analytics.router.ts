import { Router } from "express";
import { analyticsController } from "../analytics.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";

const router = Router();

router.use(AuthMiddleware);

// Admin
router.get(
  "/workspace",
  requireRole(["admin"]),
  analyticsController.getWorkspaceAnalytics,
);

// SuperAdmin
router.get(
  "/platform",
  requireRole(["super_admin"]),
  analyticsController.getPlatformAnalytics,
);

// Agent
router.get(
  "/agent",
  requireRole(["delivery_agent"]),
  analyticsController.getAgentAnalytics,
);

export default router;

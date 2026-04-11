import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./service/analytics.service";
import { SuccessResponse } from "../auth/utility/response";

class AnalyticsController {
  async getWorkspaceAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const data = await analyticsService.getWorkspaceAnalytics(workspaceId);
      return SuccessResponse(res, 200, data, "Workspace analytics fetched");
    } catch (error) {
      next(error);
    }
  }

  async getPlatformAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getPlatformAnalytics();
      return SuccessResponse(res, 200, data, "Platform analytics fetched");
    } catch (error) {
      next(error);
    }
  }

  async getAgentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: agentId, workspaceId } = (req as any).user;
      const data = await analyticsService.getAgentAnalytics(
        agentId,
        workspaceId,
      );
      return SuccessResponse(res, 200, data, "Agent analytics fetched");
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();

import { Request, Response, NextFunction } from "express";
import { subscriptionService } from "./service/subscription.service";
import { SuccessResponse } from "../auth/utility/response";

class SubscriptionController {
  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await subscriptionService.createPlan(req.body);
      return SuccessResponse(res, 201, plan, "Plan created successfully");
    } catch (error) {
      next(error);
    }
  }

  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await subscriptionService.listPlans();
      return SuccessResponse(res, 200, result, "Plans fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await subscriptionService.getPlanById(
        req.params.id as string,
      );
      return SuccessResponse(res, 200, plan, "Plan fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await subscriptionService.updatePlan(
        req.params.id as string,
        req.body,
      );
      return SuccessResponse(res, 200, plan, "Plan updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await subscriptionService.deletePlan(
        req.params.id as string,
      );
      return SuccessResponse(res, 200, plan, "Plan deactivated successfully");
    } catch (error) {
      next(error);
    }
  }

  async assignPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await subscriptionService.assignPlanToWorkspace(req.body);
      return SuccessResponse(res, 201, result, "Plan assigned successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMySubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const result =
        await subscriptionService.getWorkspaceSubscription(workspaceId);
      return SuccessResponse(res, 200, result, "Subscription fetched");
    } catch (error) {
      next(error);
    }
  }

  async updateSubscriptionStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await subscriptionService.updateSubscriptionStatus(
        req.params.id as string,
        req.body,
      );
      return SuccessResponse(res, 200, result, "Subscription status updated");
    } catch (error) {
      next(error);
    }
  }

  async listAllSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await subscriptionService.listAllSubscriptions();
      return SuccessResponse(res, 200, result, "Subscriptions fetched");
    } catch (error) {
      next(error);
    }
  }
}

export const subscriptionController = new SubscriptionController();

import { Request, Response, NextFunction } from "express";
import { superAdminService } from "./service/superAdmin.service";
import { SuccessResponse } from "../auth/utility/response";

class SuperAdminController {
  // Tenants
  async listAllTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await superAdminService.listAllTenants();
      return SuccessResponse(res, 200, tenants, "Tenants fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTenantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tenant = await superAdminService.getTenantById(id as string);
      return SuccessResponse(res, 200, tenant, "Tenant fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await superAdminService.deleteTenant(id as string);
      return SuccessResponse(res, 200, result, "Tenant deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  // plans
  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await superAdminService.createPlan(req.body);
      return SuccessResponse(res, 201, plan, "Plan created successfully");
    } catch (error) {
      next(error);
    }
  }

  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await superAdminService.listPlans();
      return SuccessResponse(res, 200, plans, "Plans fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await superAdminService.updatePlan(id as string, req.body);
      return SuccessResponse(res, 200, plan, "Plan updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await superAdminService.deletePlan(id as string);
      return SuccessResponse(res, 200, result, "Plan deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  // subscriptions
  async assignPlanToTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await superAdminService.assignPlanToTenant(req.body);
      return SuccessResponse(
        res,
        201,
        result,
        "Plan assigned to tenant successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getTenantSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subscription = await superAdminService.getTenantSubscription(
        id as string,
      );
      return SuccessResponse(
        res,
        200,
        subscription,
        "Subscription fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const superAdminController = new SuperAdminController();

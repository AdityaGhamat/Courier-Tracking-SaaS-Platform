import { Request, Response, NextFunction } from "express";
import { authService } from "./service/auth.service";
import { SuccessResponse } from "./utility/response";
import { auditService } from "../core/audit/audit.service"; // ← add this

class AuthController {
  async registerTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerTenant(req.body);

      res.cookie("session_key", result.tokens.sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_key", result.tokens.refreshCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      auditService.log({
        userId: result.user.id,
        workspaceId: result.user.workspaceId,
        action: "auth.register",
        entity: "user",
        entityId: result.user.id,
        metadata: { role: "admin" },
        req,
      });

      return SuccessResponse(
        res,
        201,
        result,
        "Tenant and Admin created successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    try {
      const result = await authService.login(req.body);

      res.cookie("session_key", result.tokens.sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_key", result.tokens.refreshCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      auditService.log({
        userId: result.user.id,
        workspaceId: result.user.workspaceId,
        action: "auth.login",
        entity: "user",
        entityId: result.user.id,
        req,
      });

      return SuccessResponse(res, 200, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async registerCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerCustomer(req.body);

      res.cookie("session_key", result.tokens.sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_key", result.tokens.refreshCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      auditService.log({
        userId: result.user.id,
        workspaceId: result.user.workspaceId,
        action: "auth.register",
        entity: "user",
        entityId: result.user.id,
        metadata: { role: "customer" },
        req,
      });

      return SuccessResponse(
        res,
        201,
        result,
        "Customer registered successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async registerAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const adminWorkspaceId = (req as any).user.workspaceId;
      const safeAgent = await authService.registerAgent(
        req.body,
        adminWorkspaceId,
      );

      auditService.log({
        userId: safeAgent.id,
        workspaceId: adminWorkspaceId,
        action: "auth.register",
        entity: "user",
        entityId: safeAgent.id,
        metadata: { role: "delivery_agent" },
        req,
      });

      return SuccessResponse(
        res,
        201,
        safeAgent,
        "Delivery Agent registered successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async refreshSession(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_key;
      const tokens = await authService.refreshSession(refreshToken);

      res.cookie("session_key", tokens.sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_key", tokens.refreshCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return SuccessResponse(res, 200, {}, "Session refreshed successfully");
    } catch (error) {
      res.clearCookie("session_key");
      res.clearCookie("refresh_key");
      next(error);
    }
  }

  async registerSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerSuperAdmin(req.body);

      res.cookie("session_key", result.tokens.sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_key", result.tokens.refreshCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      auditService.log({
        userId: result.user.id,
        action: "auth.register",
        entity: "user",
        entityId: result.user.id,
        metadata: { role: "super_admin" },
        req,
      });

      return SuccessResponse(
        res,
        201,
        result,
        "Super Admin registered successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("session_key");
      res.clearCookie("refresh_key");

      auditService.log({
        userId: (req as any).user?.id,
        workspaceId: (req as any).user?.workspaceId,
        action: "auth.logout",
        entity: "user",
        entityId: (req as any).user?.id,
        req,
      });

      return SuccessResponse(res, 200, {}, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      return SuccessResponse(res, 200, { user }, "Authenticated user");
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

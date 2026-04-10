import { Request, Response, NextFunction } from "express";
import { authService } from "./service/auth.service";
import { SuccessResponse } from "./utility/response"; // Import your utility

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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("session_key");
      res.clearCookie("refresh_key");

      return SuccessResponse(res, 200, {}, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

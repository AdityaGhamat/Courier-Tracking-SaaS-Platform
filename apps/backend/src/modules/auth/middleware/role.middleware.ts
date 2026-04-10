import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../core/errors/http.errors";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.user || !allowedRoles.includes(req.user.role)) {
      next(
        new UnauthorizedError(
          "Access denied. You do not have the required permissions.",
        ),
      );
      return;
    }
    next();
  };
};

import { Request, Response, NextFunction } from "express";
import cookie from "../utility/cookie";
import { UnauthorizedError } from "../../core/errors/http.errors";

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let tokenFromHeader;

    const tokenFromCookie = req.cookies.session_key;

    const authHeader = req?.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenFromHeader = authHeader?.split(" ")[1];
    }

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return next(new UnauthorizedError("Authentication token not found"));
    }

    const decoded = cookie.verifySessionCookie(token) as any;

    const decodedInfo = {
      id: decoded?.id,
      role: decoded?.role,
      workspaceId: decoded?.workspaceId,
    };

    (req as any).user = decodedInfo;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired session token"));
  }
}

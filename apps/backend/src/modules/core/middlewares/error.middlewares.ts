import { Request, Response, NextFunction } from "express";

export async function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!error.isOperational && !error.statusCode) {
    console.error("Critical Server Error:", error.stack);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  const details = error.details || null;

  res.status(statusCode).json({
    status: "error",
    message: message,

    ...(details && { errors: details }),
  });
}

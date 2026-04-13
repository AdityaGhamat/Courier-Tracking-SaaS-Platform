import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../core/errors/error"; // Adjust path to where you saved the classes

type ValidationTarget = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodSchema<T>, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      if (target === "query") {
        (req as any).parsedQuery = data;
      } else {
        req[target] = data as any;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails: Record<string, string> = {};

        err.issues.forEach((issue: any) => {
          const field = issue.path.join(".");

          if (issue.code === "invalid_type" && issue.received === "undefined") {
            errorDetails[field] = `${field} is required`;
          } else {
            errorDetails[field] = issue.message;
          }
        });

        return next(new ValidationError(errorDetails));
      }

      next(err);
    }
  };

import type { Response } from "express";
import { ApiResponse } from "../types/core.types";

type ResponseOptions<T> = {
  data?: T;
  message?: string;
  errors?: Record<string, any>;
  active?: boolean;
  authorization?: string;
  refresh?: string;
};

export function sendApiResponse<T>(
  res: Response,
  statusCode: number,
  options: ResponseOptions<T> = {},
) {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    active: options.active ?? true,
    data: options.data ?? ({} as T),
    message: options.message ?? "",
    errors: options.errors ?? {},
    authorization: options.authorization,
    refresh: options.refresh,
  };

  return res.status(statusCode).json(response);
}

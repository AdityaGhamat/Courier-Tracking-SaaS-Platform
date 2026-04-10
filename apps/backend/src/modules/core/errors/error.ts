export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string>) {
    super("Validation failed", 400, true, details);
  }
}

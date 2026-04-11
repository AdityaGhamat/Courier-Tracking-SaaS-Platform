export {};
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        workspaceId: string;
      };
    }
    namespace NodeJs {
      interface ProcessEnv {
        NODE_ENV: "development" | "production" | "testing";
        PORT: number;
        DATABASE_URL: string;
        COOKIE_SECRET_KEY: string;
        COOKIE_REFRESH_SECRET: string;
        RESEND_API_KEY: string;
        FROM_EMAIL: string;
        QUEUE_URL: string;
      }
    }
  }
}

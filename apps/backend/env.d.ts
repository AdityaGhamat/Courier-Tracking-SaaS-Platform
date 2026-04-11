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
        CLOUDFLARE_ACCOUNT_ID: string;
        R2_ACCESS_KEY_ID: string;
        R2_SECRET_ACCESS_KEY: string;
        R2_BUCKET_NAME: string;
        R2_TOKEN: string;
        R2_PUBLIC_URL: string;
        R2_ENDPOINT: string;
        REDIS_URL: string;
      }
    }
  }
}

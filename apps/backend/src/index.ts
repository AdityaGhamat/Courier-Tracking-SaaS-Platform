import express, { Express, NextFunction, Request, Response } from "express";
import apiRoutes from "./routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { apiRateLimit } from "./modules/core/middlewares/rateLimit.middlewares";
import { errorMiddleware } from "./modules/core/middlewares/error.middlewares";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./modules/core/swagger/swagger.config";

class Server {
  public app: Express;
  constructor() {
    this.app = express();
    dotenv.config();
    this.middleware();
    this.routes();
    this.errorHandler();
  }

  private middleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api", apiRateLimit);
  }

  private routes() {
    this.app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "Change Networks API Docs",
        swaggerOptions: { persistAuthorization: true },
      }),
    );

    this.app.use("/api", apiRoutes);

    this.app.get("/", (req: Request, res: Response) => {
      res.json({ Name: "Change Networks API", Healthy: true });
    });
  }

  private errorHandler() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error(`Route ${req.originalUrl} not found`) as any;
      error.statusCode = 404;
      next(error);
    });
    this.app.use(errorMiddleware);
  }

  public async start(port: number) {
    this.app.listen(port, "0.0.0.0", () => {
      console.log(`Server started on 0.0.0.0:${port}`);
      console.log(`Swagger Docs → http://localhost:${port}/api/docs`); // ← add
    });
  }
}

export default new Server();

import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

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
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        Name: "",
        Healthy: true,
      });
    });
  }
  private errorHandler() {}
  public async start(port: number) {
    this.app.listen(port, "0.0.0.0", () => {
      console.log(`Server started on 0.0.0.0:${port}`);
    });
  }
}
export default new Server();

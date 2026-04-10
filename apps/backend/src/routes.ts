import express from "express";
import authRoutes from "./modules/auth/router/auth.router";

const router = express.Router();

router.use("/v1/auth", authRoutes);

export default router;

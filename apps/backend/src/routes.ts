import express from "express";
import authRoutes from "./modules/auth/router/auth.router";
import shipmentRoutes from "./modules/shipment/router/shipment.router";
import trackingRoutes from "./modules/tracking/router/tracking.router";

const router = express.Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/shipments", shipmentRoutes);
router.use("/v1/track", trackingRoutes);

export default router;

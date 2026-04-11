import express from "express";
import authRoutes from "./modules/auth/router/auth.router";
import shipmentRoutes from "./modules/shipment/router/shipment.router";
import trackingRoutes from "./modules/tracking/router/tracking.router";
import hubRoutes from "./modules/hub/router/hub.router";
import superAdminRoutes from "./modules/superAdmin/router/superAdmin.router";
import vehicleRoutes from "./modules/vehicle/router/vehicle.router";
import paymentRoutes from "./modules/payment/router/payment.router";
const router = express.Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/shipments", shipmentRoutes);
router.use("/v1/track", trackingRoutes);
router.use("/v1/hubs", hubRoutes);
router.use("/v1/super-admin", superAdminRoutes);
router.use("/v1/vehicles", vehicleRoutes);
router.use("/v1/payments", paymentRoutes);

export default router;

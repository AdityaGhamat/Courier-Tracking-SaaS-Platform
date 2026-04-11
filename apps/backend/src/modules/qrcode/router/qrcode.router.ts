import { Router } from "express";
import { qrCodeController } from "../qrcode.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";

const router = Router();

router.use(AuthMiddleware);

router.get("/:id", requireRole(["admin"]), qrCodeController.getQRCode);

router.get(
  "/:id/download",
  requireRole(["admin"]),
  qrCodeController.downloadQRCode,
);

export default router;

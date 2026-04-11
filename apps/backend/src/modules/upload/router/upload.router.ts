import { Router } from "express";
import { uploadController } from "../upload.controller";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { requireRole } from "../../auth/middleware/role.middleware";
import { upload, imageUpload } from "../middleware/multer.middleware";
import { uploadRateLimit } from "../../core/middlewares/rateLimit.middlewares";

const router = Router();

router.use(AuthMiddleware);

// Any authenticated user
router.post(
  "/avatar",
  uploadRateLimit,
  imageUpload.single("file"),
  uploadController.uploadAvatar,
);

// Admin only
router.post(
  "/logo",
  requireRole(["admin"]),
  uploadRateLimit,
  imageUpload.single("file"),
  uploadController.uploadWorkspaceLogo,
);

// Delivery agent only
router.post(
  "/delivery-proof/:parcelId",
  requireRole(["delivery_agent"]),
  uploadRateLimit,
  upload.single("file"),
  uploadController.uploadDeliveryProof,
);

// Admin only
router.post(
  "/label/:parcelId",
  requireRole(["admin"]),
  uploadRateLimit,
  upload.single("file"),
  uploadController.uploadLabel,
);

export default router;

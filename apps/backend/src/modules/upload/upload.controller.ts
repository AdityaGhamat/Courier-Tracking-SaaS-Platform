import { Request, Response, NextFunction } from "express";
import { uploadService } from "./service/upload.service";
import { SuccessResponse } from "../auth/utility/response";
import { BadRequestError, NotFoundError } from "../core/errors/http.errors";
import { db } from "../core/database";
import { users, workspaces, parcels } from "../core/database/schema";
import { eq } from "drizzle-orm";
import { auditService } from "../core/audit/audit.service"; // ← add this

class UploadController {
  // =====================
  // Upload avatar (any authenticated user)
  // =====================
  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequestError("No file provided");

      const { id: userId } = (req as any).user;

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { avatarUrl: true },
      });

      const { publicUrl } = await uploadService.replaceFile(
        user?.avatarUrl ?? null,
        req.file,
        "avatars",
      );

      await db
        .update(users)
        .set({ avatarUrl: publicUrl })
        .where(eq(users.id, userId));

      auditService.log({
        userId,
        action: "upload.avatar",
        entity: "user",
        entityId: userId,
        req,
      });

      return SuccessResponse(
        res,
        200,
        { avatarUrl: publicUrl },
        "Avatar uploaded successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // =====================
  // Upload workspace logo (admin only)
  // =====================
  async uploadWorkspaceLogo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequestError("No file provided");

      const { id: userId, workspaceId } = (req as any).user;

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, workspaceId),
        columns: { logoUrl: true },
      });

      if (!workspace) throw new NotFoundError("Workspace not found");

      const { publicUrl } = await uploadService.replaceFile(
        workspace.logoUrl ?? null,
        req.file,
        "logos",
      );

      await db
        .update(workspaces)
        .set({ logoUrl: publicUrl })
        .where(eq(workspaces.id, workspaceId));

      auditService.log({
        userId,
        workspaceId,
        action: "upload.logo",
        entity: "workspace",
        entityId: workspaceId,
        req,
      });

      return SuccessResponse(
        res,
        200,
        { logoUrl: publicUrl },
        "Logo uploaded successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // =====================
  // Upload delivery proof (agent only)
  // =====================
  async uploadDeliveryProof(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequestError("No file provided");

      const { parcelId } = req.params;
      const { id: userId, workspaceId } = (req as any).user;

      const parcel = await db.query.parcels.findFirst({
        where: eq(parcels.id, parcelId as string),
        columns: { deliveryProofUrl: true, workspaceId: true },
      });

      if (!parcel) throw new NotFoundError("Parcel not found");
      if (parcel.workspaceId !== workspaceId)
        throw new NotFoundError("Parcel not found");

      const { publicUrl } = await uploadService.replaceFile(
        parcel.deliveryProofUrl ?? null,
        req.file,
        "delivery-proofs",
      );

      await db
        .update(parcels)
        .set({ deliveryProofUrl: publicUrl })
        .where(eq(parcels.id, parcelId as string));

      auditService.log({
        userId,
        workspaceId,
        action: "upload.delivery_proof",
        entity: "shipment",
        entityId: parcelId as string,
        req,
      });

      return SuccessResponse(
        res,
        200,
        { deliveryProofUrl: publicUrl },
        "Delivery proof uploaded successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // =====================
  // Upload shipment label (admin only)
  // =====================
  async uploadLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequestError("No file provided");

      const { parcelId } = req.params;
      const { id: userId, workspaceId } = (req as any).user;

      const parcel = await db.query.parcels.findFirst({
        where: eq(parcels.id, parcelId as string),
        columns: { labelUrl: true, workspaceId: true },
      });

      if (!parcel) throw new NotFoundError("Parcel not found");
      if (parcel.workspaceId !== workspaceId)
        throw new NotFoundError("Parcel not found");

      const { publicUrl } = await uploadService.replaceFile(
        parcel.labelUrl ?? null,
        req.file,
        "labels",
      );

      await db
        .update(parcels)
        .set({ labelUrl: publicUrl })
        .where(eq(parcels.id, parcelId as string));

      auditService.log({
        userId,
        workspaceId,
        action: "upload.label",
        entity: "shipment",
        entityId: parcelId as string,
        req,
      });

      return SuccessResponse(
        res,
        200,
        { labelUrl: publicUrl },
        "Label uploaded successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();

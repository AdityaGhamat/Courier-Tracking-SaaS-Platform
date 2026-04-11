import { Request, Response, NextFunction } from "express";
import { qrCodeService } from "./service/qrcode.service";
import { SuccessResponse } from "../auth/utility/response";

class QRCodeController {
  async getQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { workspaceId } = (req as any).user;

      const result = await qrCodeService.generateForShipment(
        id as string,
        workspaceId,
      );

      return SuccessResponse(res, 200, result, "QR code generated");
    } catch (error) {
      next(error);
    }
  }

  async downloadQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { workspaceId } = (req as any).user;

      const { buffer, trackingNumber } =
        await qrCodeService.generateBufferForShipment(
          id as string,
          workspaceId,
        );

      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="qr-${trackingNumber}.png"`,
      );
      res.setHeader("Content-Length", buffer.length);

      return res.end(buffer);
    } catch (error) {
      next(error);
    }
  }
}

export const qrCodeController = new QRCodeController();

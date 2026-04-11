import QRCode from "qrcode";
import { db } from "../../core/database";
import { parcels } from "../../core/database/schema";
import { eq, and } from "drizzle-orm";
import { NotFoundError } from "../../core/errors/http.errors";

const TRACKING_BASE_URL = process.env.TRACKING_BASE_URL;

class QRCodeService {
  async generateForShipment(
    shipmentId: string,
    workspaceId: string,
  ): Promise<{ qrBase64: string; trackingUrl: string }> {
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
      columns: { id: true, trackingNumber: true },
    });

    if (!parcel) throw new NotFoundError("Shipment not found");

    const trackingUrl = `${TRACKING_BASE_URL}/${parcel.trackingNumber}`;

    const qrBase64 = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return { qrBase64, trackingUrl };
  }

  async generateBufferForShipment(
    shipmentId: string,
    workspaceId: string,
  ): Promise<{ buffer: Buffer; trackingNumber: string }> {
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
      columns: { id: true, trackingNumber: true },
    });

    if (!parcel) throw new NotFoundError("Shipment not found");

    const trackingUrl = `${TRACKING_BASE_URL}/${parcel.trackingNumber}`;

    const buffer = await QRCode.toBuffer(trackingUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });

    return { buffer, trackingNumber: parcel.trackingNumber };
  }
}

export const qrCodeService = new QRCodeService();

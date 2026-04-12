import { fetcher } from "@/lib/fetcher";

export type QRCodeResponse = {
  success: boolean;
  message: string;
  data: { qrCode: string; trackingNumber: string };
};

export const qrCodeService = {
  getQRCode: (shipmentId: string) =>
    fetcher<QRCodeResponse>(`/api/qrcode/${shipmentId}`),

  getDownloadUrl: (shipmentId: string) => `/api/qrcode/${shipmentId}/download`,
};

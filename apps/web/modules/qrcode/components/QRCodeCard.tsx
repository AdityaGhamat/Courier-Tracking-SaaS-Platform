"use client";
import { useQRCode } from "../hooks/useQRCode";
import { qrCodeService } from "../services/qrcode.service";

export default function QRCodeCard({
  shipmentId,
  trackingNumber,
}: {
  shipmentId: string;
  trackingNumber: string;
}) {
  const { data, isLoading, error } = useQRCode(shipmentId);

  return (
    <div className="bg-white border rounded-xl p-5 flex flex-col items-center gap-4 w-fit">
      <p className="text-sm font-medium text-gray-700">QR Code</p>
      {isLoading && (
        <div className="w-40 h-40 bg-gray-100 rounded-lg animate-pulse" />
      )}
      {error && <p className="text-red-500 text-xs">Failed to load QR</p>}
      {data?.data?.qrCode && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.data.qrCode}
          alt={`QR for ${trackingNumber}`}
          className="w-40 h-40"
        />
      )}
      <a
        href={qrCodeService.getDownloadUrl(shipmentId)}
        download={`qr-${trackingNumber}.png`}
        className="text-xs text-blue-600 hover:underline"
      >
        Download PNG
      </a>
    </div>
  );
}

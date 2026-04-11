import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "../config/r2.config";
import { randomUUID } from "crypto";
import path from "path";

export type UploadFolder =
  | "avatars"
  | "logos"
  | "delivery-proofs"
  | "labels"
  | "tracking-photos";

class UploadService {
  // =====================
  // Upload a file buffer to R2
  // =====================
  async uploadFile(
    file: Express.Multer.File,
    folder: UploadFolder,
  ): Promise<{ key: string; publicUrl: string }> {
    const ext = path.extname(file.originalname).toLowerCase();
    const key = `${folder}/${randomUUID()}${ext}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return { key, publicUrl };
  }

  // =====================
  // Delete a file from R2 by its key
  // =====================
  async deleteFile(key: string): Promise<void> {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }),
    );
  }

  extractKeyFromUrl(publicUrl: string): string {
    return publicUrl.replace(`${R2_PUBLIC_URL}/`, "");
  }

  async replaceFile(
    oldUrl: string | null,
    newFile: Express.Multer.File,
    folder: UploadFolder,
  ): Promise<{ key: string; publicUrl: string }> {
    if (oldUrl) {
      const oldKey = this.extractKeyFromUrl(oldUrl);
      await this.deleteFile(oldKey).catch(() => {
        console.warn(`Failed to delete old file: ${oldKey}`);
      });
    }

    return this.uploadFile(newFile, folder);
  }
}

export const uploadService = new UploadService();

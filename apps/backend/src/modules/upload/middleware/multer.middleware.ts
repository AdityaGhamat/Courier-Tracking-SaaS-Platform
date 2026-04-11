import multer from "multer";
import { BadRequestError } from "../../core/errors/http.errors";

const storage = multer.memoryStorage();

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const documentFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid file type. Only JPEG, PNG, WebP and PDF are allowed",
      ) as any,
    );
  }
};

const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid file type. Only JPEG, PNG and WebP are allowed",
      ) as any,
    );
  }
};

// for delivery proof + label
export const upload = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// images only
export const imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

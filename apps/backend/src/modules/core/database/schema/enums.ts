import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "customer",
  "driver",
  "delivery_agent",
]);
export const parcelStatusEnum = pgEnum("parcel_status", [
  "label_created",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "bike",
  "car",
  "van",
  "truck",
]);

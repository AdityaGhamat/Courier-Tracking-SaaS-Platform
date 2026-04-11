import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "customer",
  "driver",
  "delivery_agent",
]);
export const parcelStatusEnum = pgEnum("parcel_status", [
  "label_created",
  "picked_up",
  "at_sorting_facility",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
  "retry",
  "returned",
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

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "expired",
  "cancelled",
]);

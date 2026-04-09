import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";
import { paymentStatusEnum } from "./enums";
import { parcels } from "./parcels";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  parcelId: uuid("parcel_id")
    .references(() => parcels.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

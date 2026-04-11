import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { parcelStatusEnum } from "./enums";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { hubs } from "./hubs";

export const parcels = pgTable(
  "parcels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    trackingNumber: varchar("tracking_number", { length: 50 })
      .notNull()
      .unique(),

    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id)
      .notNull(),
    senderId: uuid("sender_id")
      .references(() => users.id)
      .notNull(),
    driverId: uuid("driver_id").references(() => users.id),

    hubId: uuid("hub_id").references(() => hubs.id),

    recipientName: varchar("recipient_name", { length: 255 }).notNull(),
    recipientAddress: text("recipient_address").notNull(),
    recipientPhone: varchar("recipient_phone", { length: 20 }),
    recipientEmail: varchar("recipient_email", { length: 255 }),

    status: parcelStatusEnum("status").default("label_created").notNull(),
    weight: decimal("weight", { precision: 10, scale: 2 }),
    estimatedDelivery: timestamp("estimated_delivery"),
    labelUrl: text("label_url"),
    deliveryProofUrl: text("delivery_proof_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    senderIdx: index("parcel_sender_idx").on(table.senderId),
    driverIdx: index("parcel_driver_idx").on(table.driverId),
    workspaceIdx: index("parcel_workspace_idx").on(table.workspaceId),
    statusIdx: index("parcel_status_idx").on(table.status),
  }),
);

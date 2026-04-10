import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { parcels } from "./parcels";
import { parcelStatusEnum } from "./enums";
import { users } from "./users";

export const trackingEvents = pgTable(
  "tracking_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parcelId: uuid("parcel_id")
      .references(() => parcels.id, { onDelete: "cascade" })
      .notNull(),

    status: parcelStatusEnum("status").notNull(),
    agentId: uuid("agent_id").references(() => users.id),

    location: varchar("location", { length: 255 }).notNull(),
    description: text("description").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => ({
    parcelIdx: index("event_parcel_idx").on(table.parcelId),
  }),
);

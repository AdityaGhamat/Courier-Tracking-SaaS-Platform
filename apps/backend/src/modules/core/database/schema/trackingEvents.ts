import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { parcels } from "./parcels";

export const trackingEvents = pgTable(
  "tracking_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parcelId: uuid("parcel_id")
      .references(() => parcels.id, { onDelete: "cascade" })
      .notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    description: text("description").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => ({
    parcelIdx: index("event_parcel_idx").on(table.parcelId),
  }),
);

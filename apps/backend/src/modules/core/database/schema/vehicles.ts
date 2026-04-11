import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { vehicleTypeEnum } from "./enums";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: vehicleTypeEnum("type").notNull(),
  licensePlate: varchar("license_plate", { length: 20 }).notNull().unique(),
  capacityKg: decimal("capacity_kg", { precision: 10, scale: 2 }),
  driverId: uuid("driver_id").references(() => users.id),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id)
    .notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

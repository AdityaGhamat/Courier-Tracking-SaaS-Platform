import { pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";
import { vehicleTypeEnum } from "./enums";
import { users } from "./users";

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: vehicleTypeEnum("type").notNull(),
  licensePlate: varchar("license_plate", { length: 20 }).notNull().unique(),
  capacityKg: decimal("capacity_kg", { precision: 10, scale: 2 }),
  driverId: uuid("driver_id").references(() => users.id),
});

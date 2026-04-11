import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"; // ← add text
import { users } from "./users";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

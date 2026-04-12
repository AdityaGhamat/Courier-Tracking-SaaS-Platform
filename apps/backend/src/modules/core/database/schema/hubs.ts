import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const hubs = pgTable(
  "hubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").default(true).notNull(),

    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id)
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index("hub_workspace_idx").on(table.workspaceId),
  }),
);

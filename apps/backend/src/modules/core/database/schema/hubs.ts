import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  index,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const hubs = pgTable(
  "hubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),

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

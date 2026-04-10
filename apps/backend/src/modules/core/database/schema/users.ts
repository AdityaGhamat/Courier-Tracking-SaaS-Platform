import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
  workspaceId: uuid("workspace_id").references(
    (): AnyPgColumn => workspaces.id,
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

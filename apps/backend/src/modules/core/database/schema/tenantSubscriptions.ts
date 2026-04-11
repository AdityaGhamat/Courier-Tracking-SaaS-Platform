import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { subscriptionStatusEnum } from "./enums";
import { workspaces } from "./workspaces";
import { subscriptionPlans } from "./subscriptionPlans";

export const tenantSubscriptions = pgTable("tenant_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id)
    .notNull(),
  planId: uuid("plan_id")
    .references(() => subscriptionPlans.id)
    .notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

import { pgTable, uuid, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { subscriptionPlans } from "./subscriptionPlans";
import { subscriptionStatusEnum } from "./enums";

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id)
      .notNull(),
    planId: uuid("plan_id")
      .references(() => subscriptionPlans.id)
      .notNull(),
    status: subscriptionStatusEnum("status").default("active").notNull(),
    startDate: timestamp("start_date").defaultNow().notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    workspaceIdx: index("sub_workspace_idx").on(table.workspaceId),
  }),
);

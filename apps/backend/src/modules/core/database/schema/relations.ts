import { relations } from "drizzle-orm";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { parcels } from "./parcels";
import { trackingEvents } from "./trackingEvents";
import { payments } from "./payments";
import { vehicles } from "./vehicles";
import { hubs } from "./hubs";

export const usersRelations = relations(users, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [users.workspaceId],
    references: [workspaces.id],
  }),
  ownedWorkspaces: many(workspaces, { relationName: "workspaceOwner" }),
  sentParcels: many(parcels, { relationName: "sender" }),
  deliveredParcels: many(parcels, { relationName: "driver" }),
  vehicle: many(vehicles),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  staff: many(users),
  parcels: many(parcels),
  hubs: many(hubs),
}));

export const parcelsRelations = relations(parcels, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [parcels.workspaceId],
    references: [workspaces.id],
  }),
  sender: one(users, {
    fields: [parcels.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  driver: one(users, {
    fields: [parcels.driverId],
    references: [users.id],
    relationName: "driver",
  }),
  events: many(trackingEvents),
  payments: many(payments),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  parcel: one(parcels, {
    fields: [trackingEvents.parcelId],
    references: [parcels.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  parcel: one(parcels, {
    fields: [payments.parcelId],
    references: [parcels.id],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  driver: one(users, {
    fields: [vehicles.driverId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [vehicles.workspaceId],
    references: [workspaces.id],
  }),
}));

export const hubsRelations = relations(hubs, ({ one, many }) => ({
  // ← ADDED
  workspace: one(workspaces, {
    fields: [hubs.workspaceId],
    references: [workspaces.id],
  }),
  parcels: many(parcels),
}));

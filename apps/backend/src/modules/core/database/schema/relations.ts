import { relations } from "drizzle-orm";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { parcels } from "./parcels";
import { trackingEvents } from "./trackingEvents";
import { payments } from "./payments";
import { vehicles } from "./vehicles";

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  sentParcels: many(parcels, { relationName: "sender" }),
  deliveredParcels: many(parcels, { relationName: "driver" }),
  vehicle: many(vehicles),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  parcels: many(parcels),
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
  payment: one(payments, {
    fields: [parcels.id],
    references: [payments.parcelId],
  }),
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
}));

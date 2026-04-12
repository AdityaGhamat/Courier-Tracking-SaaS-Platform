import { db } from "../../core/database";
import { hubs, parcels } from "../../core/database/schema";
import { eq, and } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreateHubInput,
  UpdateHubInput,
  AssignHubInput,
} from "../validation/hub.validation";

class HubService {
  async createHub(workspaceId: string, data: CreateHubInput) {
    const [hub] = await db
      .insert(hubs)
      .values({ ...data, workspaceId })
      .returning();
    return hub;
  }

  async listHubs(workspaceId: string) {
    return db.query.hubs.findMany({
      where: eq(hubs.workspaceId, workspaceId),
      orderBy: (hubs, { desc }) => [desc(hubs.createdAt)],
    });
  }

  async getHubById(hubId: string, workspaceId: string) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });
    if (!hub) throw new NotFoundError("Hub not found");
    return hub;
  }

  async updateHub(hubId: string, workspaceId: string, data: UpdateHubInput) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });
    if (!hub) throw new NotFoundError("Hub not found");

    const [updated] = await db
      .update(hubs)
      .set(data)
      .where(eq(hubs.id, hubId))
      .returning();
    return updated;
  }

  async deleteHub(hubId: string, workspaceId: string) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });
    if (!hub) throw new NotFoundError("Hub not found");

    const [updated] = await db
      .update(hubs)
      .set({ isActive: false })
      .where(eq(hubs.id, hubId))
      .returning();
    return updated;
  }

  async assignShipmentToHub(
    shipmentId: string,
    workspaceId: string,
    data: AssignHubInput,
  ) {
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });
    if (!parcel) throw new NotFoundError("Shipment not found");

    const hub = await db.query.hubs.findFirst({
      where: and(
        eq(hubs.id, data.hubId),
        eq(hubs.workspaceId, workspaceId),
        eq(hubs.isActive, true),
      ),
    });
    if (!hub) throw new BadRequestError("Hub not found or inactive");

    const [updated] = await db
      .update(parcels)
      .set({ hubId: data.hubId })
      .where(eq(parcels.id, shipmentId))
      .returning();
    return updated;
  }

  async getHubShipments(hubId: string, workspaceId: string) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });
    if (!hub) throw new NotFoundError("Hub not found");

    return db.query.parcels.findMany({
      where: and(
        eq(parcels.hubId, hubId),
        eq(parcels.workspaceId, workspaceId),
      ),
      with: {
        sender: { columns: { id: true, name: true, email: true } },
        driver: { columns: { id: true, name: true } },
      },
    });
  }
}

export const hubService = new HubService();

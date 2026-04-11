import { db } from "../../core/database";
import { hubs, parcels } from "../../core/database/schema";
import { eq, and } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreateHubInput,
  UpdateHubInput,
  AssignShipmentToHubInput,
} from "../validation/hub.validation";

class HubService {
  async createHub(data: CreateHubInput, workspaceId: string) {
    const existingHub = await db.query.hubs.findFirst({
      where: and(eq(hubs.name, data.name), eq(hubs.workspaceId, workspaceId)),
    });

    if (existingHub) {
      throw new BadRequestError(
        "A hub with this name already exists in your workspace",
      );
    }

    const [newHub] = await db
      .insert(hubs)
      .values({
        name: data.name,
        address: data.address,
        workspaceId,
      })
      .returning();

    return newHub;
  }

  async listHubs(workspaceId: string) {
    const hubList = await db.query.hubs.findMany({
      where: eq(hubs.workspaceId, workspaceId),
    });

    return hubList;
  }

  async getHubById(hubId: string, workspaceId: string) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });

    if (!hub) {
      throw new NotFoundError("Hub not found");
    }

    return hub;
  }

  async updateHub(hubId: string, workspaceId: string, data: UpdateHubInput) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });

    if (!hub) {
      throw new NotFoundError("Hub not found");
    }

    const [updatedHub] = await db
      .update(hubs)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        updatedAt: new Date(),
      })
      .where(eq(hubs.id, hubId))
      .returning();

    return updatedHub;
  }

  async deleteHub(hubId: string, workspaceId: string) {
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });

    if (!hub) {
      throw new NotFoundError("Hub not found");
    }

    // Check if hub has active shipments
    const activeShipments = await db.query.parcels.findFirst({
      where: eq(parcels.hubId, hubId),
    });

    if (activeShipments) {
      throw new BadRequestError(
        "Cannot delete hub with assigned shipments. Reassign shipments first.",
      );
    }

    await db.delete(hubs).where(eq(hubs.id, hubId));

    return { message: "Hub deleted successfully" };
  }

  async assignShipmentToHub(
    hubId: string,
    workspaceId: string,
    data: AssignShipmentToHubInput,
  ) {
    // Verify hub exists in this workspace
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });

    if (!hub) {
      throw new NotFoundError("Hub not found");
    }

    // Verify shipment exists in this workspace
    const shipment = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, data.shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!shipment) {
      throw new NotFoundError("Shipment not found");
    }

    const [updatedParcel] = await db
      .update(parcels)
      .set({ hubId, updatedAt: new Date() })
      .where(eq(parcels.id, data.shipmentId))
      .returning();

    return updatedParcel;
  }

  async getHubShipments(hubId: string, workspaceId: string) {
    // Verify hub belongs to workspace
    const hub = await db.query.hubs.findFirst({
      where: and(eq(hubs.id, hubId), eq(hubs.workspaceId, workspaceId)),
    });

    if (!hub) {
      throw new NotFoundError("Hub not found");
    }

    const shipments = await db.query.parcels.findMany({
      where: eq(parcels.hubId, hubId),
      with: {
        sender: {
          columns: { id: true, name: true, email: true },
        },
        driver: {
          columns: { id: true, name: true, email: true },
        },
      },
    });

    return { hub, shipments };
  }
}

export const hubService = new HubService();

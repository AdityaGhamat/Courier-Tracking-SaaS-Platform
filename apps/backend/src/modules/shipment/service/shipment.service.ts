import { db } from "../../core/database";
import { parcels, trackingEvents, users } from "../../core/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../core/errors/http.errors";
import {
  CreateShipmentInput,
  UpdateShipmentStatusInput,
  AssignAgentInput,
} from "../validation/shipment.validation";
import { generateTrackingNumber } from "../utility/tracking.utility";
import { jobService } from "../../core/jobs/service/jobs.service";
import { analyticsService } from "../../analytics/service/analytics.service";
import { cacheService } from "../../core/redis/service/cache.service";

class ShipmentService {
  async createShipment(
    data: CreateShipmentInput,
    senderId: string,
    workspaceId: string,
  ) {
    const trackingNumber = generateTrackingNumber();

    const sender = await db.query.users.findFirst({
      where: eq(users.id, senderId),
      columns: { name: true, email: true },
    });

    const [newParcel] = await db
      .insert(parcels)
      .values({
        trackingNumber,
        workspaceId,
        senderId,
        recipientName: data.recipientName,
        recipientAddress: data.recipientAddress,
        recipientPhone: data.recipientPhone,
        recipientEmail: data.recipientEmail,
        weight: data.weight,
        estimatedDelivery: data.estimatedDelivery
          ? new Date(data.estimatedDelivery)
          : undefined,
        status: "label_created",
      })
      .returning();

    await db.insert(trackingEvents).values({
      parcelId: newParcel.id,
      status: "label_created",
      location: "Origin",
      description: "Shipment label created and registered in the system",
    });

    if (data.recipientEmail) {
      jobService.enqueue("send.shipment_created", {
        recipientEmail: data.recipientEmail,
        recipientName: data.recipientName,
        trackingNumber,
        senderName: sender?.name ?? "Unknown",
      });
    }

    return newParcel;
  }

  async getShipmentById(shipmentId: string, workspaceId: string) {
    const shipment = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
      with: {
        events: { orderBy: [desc(trackingEvents.timestamp)] },
        sender: { columns: { id: true, name: true, email: true } },
        driver: { columns: { id: true, name: true, email: true } },
      },
    });

    if (!shipment) throw new NotFoundError("Shipment not found");

    return shipment;
  }

  async listShipments(
    workspaceId: string,
    page: number,
    limit: number,
    status?: string,
  ) {
    const offset = (page - 1) * limit;

    const conditions = status
      ? and(
          eq(parcels.workspaceId, workspaceId),
          eq(parcels.status, status as any),
        )
      : eq(parcels.workspaceId, workspaceId);

    const shipmentList = await db.query.parcels.findMany({
      where: conditions,
      orderBy: [desc(parcels.createdAt)],
      limit,
      offset,
      with: {
        sender: { columns: { id: true, name: true, email: true } },
        driver: { columns: { id: true, name: true, email: true } },
      },
    });

    return { shipments: shipmentList, page, limit };
  }

  async updateShipmentStatus(
    shipmentId: string,
    workspaceId: string,
    agentId: string,
    data: UpdateShipmentStatusInput,
  ) {
    const shipment = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!shipment) throw new NotFoundError("Shipment not found");

    if (data.status === "delivered" && !shipment.deliveryProofUrl) {
      throw new BadRequestError(
        "Delivery proof photo must be uploaded before marking shipment as delivered",
      );
    }

    const [updatedParcel] = await db
      .update(parcels)
      .set({ status: data.status as any, updatedAt: new Date() })
      .where(eq(parcels.id, shipmentId))
      .returning();

    const now = new Date();

    await db.insert(trackingEvents).values({
      parcelId: shipmentId,
      status: data.status as any,
      agentId,
      location: data.location,
      description: data.description,
    });

    await analyticsService.invalidateAnalyticsCache(
      workspaceId,
      shipment.driverId ?? undefined,
    );
    await cacheService.del(`tracking:${shipment.trackingNumber}`);

    if (shipment.recipientEmail) {
      const base = {
        recipientEmail: shipment.recipientEmail,
        recipientName: shipment.recipientName,
        trackingNumber: shipment.trackingNumber,
      };

      if (data.status === "out_for_delivery") {
        const agent = await db.query.users.findFirst({
          where: eq(users.id, agentId),
          columns: { name: true },
        });
        jobService.enqueue("send.out_for_delivery", {
          ...base,
          agentName: agent?.name ?? "Your delivery agent",
          estimatedDelivery: shipment.estimatedDelivery ?? undefined,
        });
      } else if (data.status === "delivered") {
        jobService.enqueue("send.delivered", {
          ...base,
          timestamp: now,
        });
      } else if (data.status === "failed") {
        jobService.enqueue("send.delivery_failed", {
          ...base,
          reason: data.description ?? "Delivery attempt failed",
          timestamp: now,
        });
      } else {
        jobService.enqueue("send.status_updated", {
          ...base,
          status: data.status,
          location: data.location,
          description: data.description,
          timestamp: now,
        });
      }
    }

    return updatedParcel;
  }

  async assignAgent(
    shipmentId: string,
    workspaceId: string,
    data: AssignAgentInput,
  ) {
    const shipment = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, shipmentId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!shipment) throw new NotFoundError("Shipment not found");

    const agent = await db.query.users.findFirst({
      where: and(
        eq(users.id, data.agentId),
        eq(users.workspaceId, workspaceId),
        eq(users.role, "delivery_agent"),
      ),
    });

    if (!agent) {
      throw new BadRequestError(
        "Agent not found or does not belong to this workspace",
      );
    }

    const [updatedParcel] = await db
      .update(parcels)
      .set({ driverId: data.agentId, updatedAt: new Date() })
      .where(eq(parcels.id, shipmentId))
      .returning();

    if (shipment.recipientEmail) {
      jobService.enqueue("send.agent_assigned", {
        recipientEmail: shipment.recipientEmail,
        recipientName: shipment.recipientName,
        trackingNumber: shipment.trackingNumber,
        agentName: agent.name,
      });
    }

    return updatedParcel;
  }

  async getMyShipments(customerId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const shipmentList = await db.query.parcels.findMany({
      where: eq(parcels.senderId, customerId),
      orderBy: [desc(parcels.createdAt)],
      limit,
      offset,
      with: {
        events: { orderBy: [desc(trackingEvents.timestamp)] },
      },
    });

    return { shipments: shipmentList, page, limit };
  }

  async getAgentShipments(agentId: string, workspaceId: string) {
    const shipmentList = await db.query.parcels.findMany({
      where: and(
        eq(parcels.driverId, agentId),
        eq(parcels.workspaceId, workspaceId),
      ),
      orderBy: [desc(parcels.createdAt)],
      with: {
        events: { orderBy: [desc(trackingEvents.timestamp)] },
      },
    });

    return shipmentList;
  }
}

export const shipmentService = new ShipmentService();

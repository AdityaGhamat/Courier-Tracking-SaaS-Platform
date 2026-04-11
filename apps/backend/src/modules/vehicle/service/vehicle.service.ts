import { db } from "../../core/database";
import { vehicles, users } from "../../core/database/schema";
import { eq, and } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  AssignAgentToVehicleInput,
} from "../validation/vehicle.validation";

class VehicleService {
  async createVehicle(data: CreateVehicleInput, workspaceId: string) {
    // Check duplicate license plate within workspace
    const existing = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.licensePlate, data.licensePlate),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (existing) {
      throw new BadRequestError(
        "A vehicle with this license plate already exists in your workspace",
      );
    }

    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        type: data.type,
        licensePlate: data.licensePlate,
        capacityKg: data.capacityKg,
        workspaceId,
        isAvailable: true,
      })
      .returning();

    return newVehicle;
  }

  async listVehicles(workspaceId: string) {
    const vehicleList = await db.query.vehicles.findMany({
      where: eq(vehicles.workspaceId, workspaceId),
      with: {
        driver: {
          columns: { id: true, name: true, email: true },
        },
      },
    });

    return vehicleList;
  }

  async getVehicleById(vehicleId: string, workspaceId: string) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.workspaceId, workspaceId),
      ),
      with: {
        driver: {
          columns: { id: true, name: true, email: true },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    return vehicle;
  }

  async updateVehicle(
    vehicleId: string,
    workspaceId: string,
    data: UpdateVehicleInput,
  ) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        ...(data.type && { type: data.type }),
        ...(data.licensePlate && { licensePlate: data.licensePlate }),
        ...(data.capacityKg && { capacityKg: data.capacityKg }),
        ...(data.isAvailable !== undefined && {
          isAvailable: data.isAvailable,
        }),
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, vehicleId))
      .returning();

    return updatedVehicle;
  }

  async deleteVehicle(vehicleId: string, workspaceId: string) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    if (vehicle.driverId) {
      throw new BadRequestError(
        "Cannot delete a vehicle with an assigned agent. Unassign the agent first.",
      );
    }

    await db.delete(vehicles).where(eq(vehicles.id, vehicleId));

    return { message: "Vehicle deleted successfully" };
  }

  async assignAgentToVehicle(
    vehicleId: string,
    workspaceId: string,
    data: AssignAgentToVehicleInput,
  ) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    // Verify agent exists and belongs to workspace
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

    // Check if agent already has a vehicle
    const agentVehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.driverId, data.agentId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (agentVehicle) {
      throw new BadRequestError(
        `Agent is already assigned to vehicle: ${agentVehicle.licensePlate}. Unassign first.`,
      );
    }

    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        driverId: data.agentId,
        isAvailable: false,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, vehicleId))
      .returning();

    return updatedVehicle;
  }

  async unassignAgent(vehicleId: string, workspaceId: string) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    if (!vehicle.driverId) {
      throw new BadRequestError("No agent is assigned to this vehicle");
    }

    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        driverId: null,
        isAvailable: true,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, vehicleId))
      .returning();

    return updatedVehicle;
  }

  async getMyVehicle(agentId: string, workspaceId: string) {
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.driverId, agentId),
        eq(vehicles.workspaceId, workspaceId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundError("No vehicle assigned to you");
    }

    return vehicle;
  }
}

export const vehicleService = new VehicleService();

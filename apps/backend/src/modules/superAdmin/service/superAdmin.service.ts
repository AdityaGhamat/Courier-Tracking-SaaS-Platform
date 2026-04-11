import { db } from "../../core/database";
import {
  workspaces,
  users,
  subscriptionPlans,
  tenantSubscriptions,
} from "../../core/database/schema";
import { eq, desc } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreatePlanInput,
  UpdatePlanInput,
  AssignPlanInput,
} from "../validation/superAdmin.validation";

class SuperAdminService {
  // =====================
  // TENANT MANAGEMENT
  // =====================

  async listAllTenants() {
    const tenants = await db.query.workspaces.findMany({
      orderBy: [desc(workspaces.createdAt)],
      with: {
        owner: {
          columns: { id: true, name: true, email: true, createdAt: true },
        },
      },
    });

    return tenants;
  }

  async getTenantById(workspaceId: string) {
    const tenant = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        staff: {
          columns: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundError("Tenant not found");
    }

    return tenant;
  }

  async deleteTenant(workspaceId: string) {
    const tenant = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!tenant) {
      throw new NotFoundError("Tenant not found");
    }

    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));

    return { message: "Tenant deleted successfully" };
  }

  // =====================
  // SUBSCRIPTION PLANS
  // =====================

  async createPlan(data: CreatePlanInput) {
    const existing = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.name, data.name),
    });

    if (existing) {
      throw new BadRequestError("A plan with this name already exists");
    }

    const [newPlan] = await db
      .insert(subscriptionPlans)
      .values({
        name: data.name,
        description: data.description,
        price: data.price,
        maxShipments: data.maxShipments,
        maxAgents: data.maxAgents,
      })
      .returning();

    return newPlan;
  }

  async listPlans() {
    const plans = await db.query.subscriptionPlans.findMany({
      orderBy: [desc(subscriptionPlans.createdAt)],
    });

    return plans;
  }

  async updatePlan(planId: string, data: UpdatePlanInput) {
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });

    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    const [updatedPlan] = await db
      .update(subscriptionPlans)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: data.price }),
        ...(data.maxShipments && { maxShipments: data.maxShipments }),
        ...(data.maxAgents && { maxAgents: data.maxAgents }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedAt: new Date(),
      })
      .where(eq(subscriptionPlans.id, planId))
      .returning();

    return updatedPlan;
  }

  async deletePlan(planId: string) {
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });

    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, planId));

    return { message: "Plan deleted successfully" };
  }

  // =====================
  // ASSIGN PLAN TO TENANT
  // =====================

  async assignPlanToTenant(data: AssignPlanInput) {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, data.workspaceId),
    });

    if (!workspace) {
      throw new NotFoundError("Tenant workspace not found");
    }

    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, data.planId),
    });

    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    // Deactivate any existing active subscription
    await db
      .update(tenantSubscriptions)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(tenantSubscriptions.workspaceId, data.workspaceId));

    // Create new subscription
    const [newSubscription] = await db
      .insert(tenantSubscriptions)
      .values({
        workspaceId: data.workspaceId,
        planId: data.planId,
        status: "active",
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      })
      .returning();

    return newSubscription;
  }

  async getTenantSubscription(workspaceId: string) {
    const subscription = await db.query.tenantSubscriptions.findFirst({
      where: eq(tenantSubscriptions.workspaceId, workspaceId),
      with: {
        plan: true,
      },
      orderBy: [desc(tenantSubscriptions.createdAt)],
    });

    if (!subscription) {
      throw new NotFoundError("No subscription found for this tenant");
    }

    return subscription;
  }
}

export const superAdminService = new SuperAdminService();

import { db } from "../../core/database";
import {
  subscriptionPlans,
  subscriptions,
  workspaces,
} from "../../core/database/schema";
import { eq, and } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreatePlanInput,
  UpdatePlanInput,
  AssignPlanInput,
  UpdateSubscriptionInput,
} from "../validation/subscription.validation";
import { cacheService } from "../../core/redis/service/cache.service";

class SubscriptionService {
  // =====================
  // PLAN CRUD (super_admin)
  // =====================

  async createPlan(data: CreatePlanInput) {
    const [plan] = await db.insert(subscriptionPlans).values(data).returning();
    await cacheService.del("subscription:plans:active");
    return plan;
  }

  async listPlans() {
    const cacheKey = "subscription:plans:active";

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const plans = await db.query.subscriptionPlans.findMany({
      where: eq(subscriptionPlans.isActive, true),
      orderBy: (subscriptionPlans, { asc }) => [asc(subscriptionPlans.price)],
    });

    await cacheService.set(cacheKey, plans, 600);

    return plans;
  }

  async getPlanById(planId: string) {
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });
    if (!plan) throw new NotFoundError("Plan not found");
    return plan;
  }

  async updatePlan(planId: string, data: UpdatePlanInput) {
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });
    await cacheService.del("subscription:plans:active");
    if (!plan) throw new NotFoundError("Plan not found");

    const [updated] = await db
      .update(subscriptionPlans)
      .set(data)
      .where(eq(subscriptionPlans.id, planId))
      .returning();
    await cacheService.del("subscription:plans:active");
    return updated;
  }

  async deletePlan(planId: string) {
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });
    await cacheService.del("subscription:plans:active");
    if (!plan) throw new NotFoundError("Plan not found");

    const [updated] = await db
      .update(subscriptionPlans)
      .set({ isActive: false })
      .where(eq(subscriptionPlans.id, planId))
      .returning();
    await cacheService.del("subscription:plans:active");
    return updated;
  }

  // =====================
  // SUBSCRIPTION MANAGEMENT (super_admin)
  // =====================

  async assignPlanToWorkspace(data: AssignPlanInput) {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, data.workspaceId),
    });
    if (!workspace) throw new NotFoundError("Workspace not found");

    const plan = await db.query.subscriptionPlans.findFirst({
      where: and(
        eq(subscriptionPlans.id, data.planId),
        eq(subscriptionPlans.isActive, true),
      ),
    });
    if (!plan) throw new BadRequestError("Plan not found or inactive");

    // Cancel any existing active subscription
    await db
      .update(subscriptions)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(subscriptions.workspaceId, data.workspaceId),
          eq(subscriptions.status, "active"),
        ),
      );

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        workspaceId: data.workspaceId,
        planId: data.planId,
        status: "active",
        startDate: new Date(),
        endDate: new Date(data.endDate),
      })
      .returning();

    return subscription;
  }

  async getWorkspaceSubscription(workspaceId: string) {
    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.workspaceId, workspaceId),
        eq(subscriptions.status, "active"),
      ),
      with: { plan: true },
    });
    if (!subscription) throw new NotFoundError("No active subscription found");
    return subscription;
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    data: UpdateSubscriptionInput,
  ) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.id, subscriptionId),
    });
    if (!subscription) throw new NotFoundError("Subscription not found");

    const [updated] = await db
      .update(subscriptions)
      .set({ status: data.status })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return updated;
  }

  async listAllSubscriptions() {
    return db.query.subscriptions.findMany({
      with: {
        plan: true,
        workspace: { columns: { id: true, name: true } },
      },
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
    });
  }
}

export const subscriptionService = new SubscriptionService();

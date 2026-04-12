import { db } from "../../core/database";
import { parcels, users, workspaces } from "../../core/database/schema";
import { eq, and, count, sql, gte } from "drizzle-orm";
import { cacheService } from "../../core/redis/service/cache.service";

class AnalyticsService {
  // =====================
  // Admin — workspace-scoped analytics
  // =====================
  async getWorkspaceAnalytics(workspaceId: string) {
    const cacheKey = `analytics:workspace:${workspaceId}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [shipmentStats] = await db
      .select({
        total: count(),
        delivered: sql<number>`COUNT(*) FILTER (WHERE status = 'delivered')`,
        pending: sql<number>`COUNT(*) FILTER (WHERE status = 'label_created')`,
        inTransit: sql<number>`COUNT(*) FILTER (WHERE status = 'in_transit')`,
        outForDelivery: sql<number>`COUNT(*) FILTER (WHERE status = 'out_for_delivery')`,
        failed: sql<number>`COUNT(*) FILTER (WHERE status = 'failed')`,
      })
      .from(parcels)
      .where(eq(parcels.workspaceId, workspaceId));

    const [agentCount] = await db
      .select({ total: count() })
      .from(users)
      .where(
        and(
          eq(users.workspaceId, workspaceId),
          eq(users.role, "delivery_agent"),
        ),
      );

    const [customerCount] = await db
      .select({ total: count() })
      .from(users)
      .where(
        and(eq(users.workspaceId, workspaceId), eq(users.role, "customer")),
      );

    const dailyShipments = await db
      .select({
        date: sql<string>`DATE(created_at)`,
        total: count(),
      })
      .from(parcels)
      .where(
        and(
          eq(parcels.workspaceId, workspaceId),
          gte(parcels.createdAt, sql`NOW() - INTERVAL '30 days'`),
        ),
      )
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at) ASC`);

    const result = {
      shipments: shipmentStats,
      agents: agentCount.total,
      customers: customerCount.total,
      dailyShipments,
    };

    await cacheService.set(cacheKey, result, 300);

    return result;
  }

  // =====================
  // SuperAdmin — platform-wide analytics
  // =====================
  async getPlatformAnalytics() {
    const cacheKey = `analytics:platform`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [shipmentStats] = await db
      .select({
        total: count(),
        delivered: sql<number>`COUNT(*) FILTER (WHERE status = 'delivered')`,
        failed: sql<number>`COUNT(*) FILTER (WHERE status = 'failed')`,
        inTransit: sql<number>`COUNT(*) FILTER (WHERE status = 'in_transit')`,
      })
      .from(parcels);

    const [workspaceCount] = await db
      .select({ total: count() })
      .from(workspaces);

    const [userCount] = await db.select({ total: count() }).from(users);

    const topWorkspaces = await db
      .select({
        workspaceId: parcels.workspaceId,
        workspaceName: workspaces.name,
        total: count(),
      })
      .from(parcels)
      .leftJoin(workspaces, eq(parcels.workspaceId, workspaces.id))
      .groupBy(parcels.workspaceId, workspaces.name)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    const dailyShipments = await db
      .select({
        date: sql<string>`DATE(created_at)`,
        total: count(),
      })
      .from(parcels)
      .where(gte(parcels.createdAt, sql`NOW() - INTERVAL '30 days'`))
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at) ASC`);

    const result = {
      shipments: shipmentStats,
      workspaces: workspaceCount.total,
      users: userCount.total,
      topWorkspaces,
      dailyShipments,
    };

    await cacheService.set(cacheKey, result, 600);

    return result;
  }

  // =====================
  // Agent — personal delivery analytics
  // =====================
  async getAgentAnalytics(agentId: string, workspaceId: string) {
    const cacheKey = `analytics:agent:${agentId}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [stats] = await db
      .select({
        total: count(),
        delivered: sql<number>`COUNT(*) FILTER (WHERE status = 'delivered')`,
        failed: sql<number>`COUNT(*) FILTER (WHERE status = 'failed')`,
        inTransit: sql<number>`COUNT(*) FILTER (WHERE status = 'in_transit')`,
        outForDelivery: sql<number>`COUNT(*) FILTER (WHERE status = 'out_for_delivery')`,
      })
      .from(parcels)
      .where(
        and(
          eq(parcels.driverId, agentId),
          eq(parcels.workspaceId, workspaceId),
        ),
      );

    const weeklyActivity = await db
      .select({
        date: sql<string>`DATE(updated_at)`,
        delivered: sql<number>`COUNT(*) FILTER (WHERE status = 'delivered')`,
        failed: sql<number>`COUNT(*) FILTER (WHERE status = 'failed')`,
      })
      .from(parcels)
      .where(
        and(
          eq(parcels.driverId, agentId),
          eq(parcels.workspaceId, workspaceId),
          gte(parcels.updatedAt, sql`NOW() - INTERVAL '7 days'`),
        ),
      )
      .groupBy(sql`DATE(updated_at)`)
      .orderBy(sql`DATE(updated_at) ASC`);

    const result = { stats, weeklyActivity };

    await cacheService.set(cacheKey, result, 300);

    return result;
  }

  // =====================
  // Cache Invalidation — call this from shipment.service.ts
  // when status is updated
  // =====================
  async invalidateAnalyticsCache(workspaceId: string, agentId?: string) {
    await cacheService.del(`analytics:workspace:${workspaceId}`);
    await cacheService.del(`analytics:platform`);
    if (agentId) {
      await cacheService.del(`analytics:agent:${agentId}`);
    }
  }
}

export const analyticsService = new AnalyticsService();

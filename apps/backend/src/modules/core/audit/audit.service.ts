import { db } from "../database";
import { auditLogs } from "../database/schema";
import { Request as ExpressRequest } from "express";
import { AuditLogInput } from "./types/audit.types";

class AuditService {
  async log({
    userId,
    workspaceId,
    action,
    entity,
    entityId,
    metadata,
    req,
  }: AuditLogInput) {
    try {
      await db.insert(auditLogs).values({
        userId,
        workspaceId: workspaceId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        metadata: metadata ?? null,
        ipAddress: req ? this.getIp(req) : null,
        userAgent: req ? (req.headers["user-agent"] as string) : null,
      });
    } catch (err) {
      console.error("[AuditLog] Failed to write log:", err);
    }
  }

  private getIp(req: ExpressRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress;
    return ip ?? "unknown";
  }
}

export const auditService = new AuditService();

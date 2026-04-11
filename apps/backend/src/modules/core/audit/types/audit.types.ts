import { Request } from "express";
export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "auth.register"
  | "shipment.created"
  | "shipment.status_updated"
  | "shipment.agent_assigned"
  | "upload.avatar"
  | "upload.logo"
  | "upload.delivery_proof"
  | "upload.label"
  | "workspace.logo_updated"
  | "subscription.assigned";

export interface AuditLogInput {
  userId: string;
  workspaceId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  req?: Request;
}

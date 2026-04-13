export interface ShipmentStats {
  total: number;
  delivered: number;
  pending?: number;
  inTransit: number;
  outForDelivery?: number;
  failed: number;
}

export interface DailyShipment {
  date: string; // "YYYY-MM-DD"
  total: number;
}

export interface WeeklyActivity {
  date: string;
  delivered: number;
  failed: number;
}

export interface TopWorkspace {
  workspaceId: string;
  workspaceName: string | null;
  total: number;
}

// GET /analytics/workspace  — role: admin
export interface WorkspaceAnalytics {
  shipments: ShipmentStats & { pending: number; outForDelivery: number };
  agents: number;
  customers: number;
  dailyShipments: DailyShipment[];
}

// GET /analytics/platform   — role: super_admin
export interface PlatformAnalytics {
  shipments: ShipmentStats;
  workspaces: number;
  users: number;
  topWorkspaces: TopWorkspace[];
  dailyShipments: DailyShipment[];
}

// GET /analytics/agent      — role: delivery_agent
export interface AgentAnalytics {
  stats: ShipmentStats & { outForDelivery: number };
  weeklyActivity: WeeklyActivity[];
}

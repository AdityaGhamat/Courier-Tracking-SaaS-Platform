export type WorkspaceAnalytics = {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  failed: number;
  totalAgents: number;
  totalHubs: number;
  totalVehicles: number;
};

export type AgentAnalytics = {
  totalAssigned: number;
  delivered: number;
  failed: number;
  inTransit: number;
};

export type PlatformAnalytics = {
  totalWorkspaces: number;
  totalShipments: number;
  totalUsers: number;
  activeSubscriptions: number;
};

export type AnalyticsResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

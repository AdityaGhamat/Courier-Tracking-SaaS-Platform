import { fetcher } from "@/lib/fetcher";
import type {
  WorkspaceAnalytics,
  AgentAnalytics,
  PlatformAnalytics,
  AnalyticsResponse,
} from "../types/analytics.types";

export const analyticsService = {
  getWorkspaceAnalytics: () =>
    fetcher<AnalyticsResponse<WorkspaceAnalytics>>("/api/analytics/workspace"),

  getAgentAnalytics: () =>
    fetcher<AnalyticsResponse<AgentAnalytics>>("/api/analytics/agent"),

  getPlatformAnalytics: () =>
    fetcher<AnalyticsResponse<PlatformAnalytics>>("/api/analytics/platform"),
};

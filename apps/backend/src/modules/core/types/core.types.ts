export interface ApiResponse<T> {
  success: boolean;
  active: boolean;
  data: T;
  authorization?: string;
  refresh?: string;
  message: string;
  errors: Record<string, any>;
}

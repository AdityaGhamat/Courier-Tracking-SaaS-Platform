export type Hub = {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
};

export type CreateHubInput = {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  phone?: string;
};

export type UpdateHubInput = Partial<CreateHubInput>;

export type HubListResponse = {
  success: boolean;
  message: string;
  data: Hub[];
};

export type HubResponse = {
  success: boolean;
  message: string;
  data: Hub;
};

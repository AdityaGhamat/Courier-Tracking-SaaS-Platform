export type VehicleType = "bike" | "car" | "van" | "truck";

export type Vehicle = {
  id: string;
  type: VehicleType;
  licensePlate: string;
  capacityKg?: string;
  isAvailable: boolean;
  assignedAgentId?: string;
  createdAt: string;
};

export type CreateVehicleInput = {
  type: VehicleType;
  licensePlate: string;
  capacityKg?: string;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput> & {
  isAvailable?: boolean;
};

export type AssignAgentToVehicleInput = {
  agentId: string;
};

export type VehicleListResponse = {
  success: boolean;
  message: string;
  data: Vehicle[];
};

export type VehicleResponse = {
  success: boolean;
  message: string;
  data: Vehicle;
};

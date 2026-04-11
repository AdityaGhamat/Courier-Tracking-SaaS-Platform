import { Request, Response, NextFunction } from "express";
import { vehicleService } from "./service/vehicle.service";
import { SuccessResponse } from "../auth/utility/response";

class VehicleController {
  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const vehicle = await vehicleService.createVehicle(req.body, workspaceId);
      return SuccessResponse(res, 201, vehicle, "Vehicle created successfully");
    } catch (error) {
      next(error);
    }
  }

  async listVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const vehicleList = await vehicleService.listVehicles(workspaceId);
      return SuccessResponse(
        res,
        200,
        vehicleList,
        "Vehicles fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getVehicleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(
        id as string,
        workspaceId,
      );
      return SuccessResponse(res, 200, vehicle, "Vehicle fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const vehicle = await vehicleService.updateVehicle(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(res, 200, vehicle, "Vehicle updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const result = await vehicleService.deleteVehicle(
        id as string,
        workspaceId,
      );
      return SuccessResponse(res, 200, result, "Vehicle deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async assignAgentToVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const vehicle = await vehicleService.assignAgentToVehicle(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(
        res,
        200,
        vehicle,
        "Agent assigned to vehicle successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async unassignAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const vehicle = await vehicleService.unassignAgent(
        id as string,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        vehicle,
        "Agent unassigned successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: agentId, workspaceId } = (req as any).user;
      const vehicle = await vehicleService.getMyVehicle(agentId, workspaceId);
      return SuccessResponse(
        res,
        200,
        vehicle,
        "Your vehicle fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();

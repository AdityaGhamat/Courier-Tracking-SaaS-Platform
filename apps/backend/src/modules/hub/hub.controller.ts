import { Request, Response, NextFunction } from "express";
import { hubService } from "./service/hub.service";
import { SuccessResponse } from "../auth/utility/response";

class HubController {
  async createHub(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const hub = await hubService.createHub(req.body, workspaceId);
      return SuccessResponse(res, 201, hub, "Hub created successfully");
    } catch (error) {
      next(error);
    }
  }

  async listHubs(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const hubs = await hubService.listHubs(workspaceId);
      return SuccessResponse(res, 200, hubs, "Hubs fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getHubById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const hub = await hubService.getHubById(id as string, workspaceId);
      return SuccessResponse(res, 200, hub, "Hub fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateHub(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const hub = await hubService.updateHub(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(res, 200, hub, "Hub updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteHub(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const result = await hubService.deleteHub(id as string, workspaceId);
      return SuccessResponse(res, 200, result, "Hub deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async assignShipmentToHub(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const result = await hubService.assignShipmentToHub(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(
        res,
        200,
        result,
        "Shipment assigned to hub successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getHubShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const result = await hubService.getHubShipments(
        id as string,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        result,
        "Hub shipments fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const hubController = new HubController();

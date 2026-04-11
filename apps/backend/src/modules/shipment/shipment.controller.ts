import { Request, Response, NextFunction } from "express";
import { shipmentService } from "./service/shipment.service";
import { SuccessResponse } from "../auth/utility/response";

class ShipmentController {
  async createShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: senderId, workspaceId } = (req as any).user;
      const shipment = await shipmentService.createShipment(
        req.body,
        senderId,
        workspaceId,
      );
      return SuccessResponse(
        res,
        201,
        shipment,
        "Shipment created successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getShipmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const shipment = await shipmentService.getShipmentById(
        id as string,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        shipment,
        "Shipment fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async listShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { page, limit, status } = req.query as any;
      const result = await shipmentService.listShipments(
        workspaceId,
        Number(page) || 1,
        Number(limit) || 10,
        status,
      );
      return SuccessResponse(
        res,
        200,
        result,
        "Shipments fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async updateShipmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: agentId, workspaceId } = (req as any).user;
      const { id } = req.params;
      const shipment = await shipmentService.updateShipmentStatus(
        id as string,
        workspaceId,
        agentId,
        req.body,
      );
      return SuccessResponse(
        res,
        200,
        shipment,
        "Shipment status updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async assignAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const shipment = await shipmentService.assignAgent(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(res, 200, shipment, "Agent assigned successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMyShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: customerId } = (req as any).user;
      const { page, limit } = req.query as any;
      const result = await shipmentService.getMyShipments(
        customerId,
        Number(page) || 1,
        Number(limit) || 10,
      );
      return SuccessResponse(
        res,
        200,
        result,
        "Your shipments fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getAgentShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: agentId, workspaceId } = (req as any).user;
      const shipments = await shipmentService.getAgentShipments(
        agentId,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        shipments,
        "Agent shipments fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const shipmentController = new ShipmentController();

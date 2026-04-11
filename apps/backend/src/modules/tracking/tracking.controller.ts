import { Request, Response, NextFunction } from "express";
import { trackingService } from "./service/tracking.service";
import { SuccessResponse } from "../auth/utility/response";

class TrackingController {
  async trackShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingNumber } = req.params;
      const result = await trackingService.trackByTrackingNumber(
        trackingNumber as string,
      );
      return SuccessResponse(res, 200, result, "Shipment tracked successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const trackingController = new TrackingController();

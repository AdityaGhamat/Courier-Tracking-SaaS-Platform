import { Request, Response, NextFunction } from "express";
import { paymentService } from "./service/payment.service";
import { SuccessResponse } from "../auth/utility/response";

class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const payment = await paymentService.createPayment(req.body, workspaceId);
      return SuccessResponse(
        res,
        201,
        payment,
        "Payment record created successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(
        id as string,
        workspaceId,
      );
      return SuccessResponse(res, 200, payment, "Payment fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getPaymentsByParcelId(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { parcelId } = req.params;
      const payments = await paymentService.getPaymentsByParcelId(
        parcelId as string,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        payments,
        "Payment history fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getActivePaymentByParcelId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { workspaceId } = (req as any).user;
      const { parcelId } = req.params;
      const payment = await paymentService.getActivePaymentByParcelId(
        parcelId as string,
        workspaceId,
      );
      return SuccessResponse(
        res,
        200,
        payment,
        "Active payment fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { page, limit, status } = req.query as any;
      const result = await paymentService.listPayments(
        workspaceId,
        Number(page) || 1,
        Number(limit) || 10,
        status,
      );
      return SuccessResponse(res, 200, result, "Payments fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = (req as any).user;
      const { id } = req.params;
      const payment = await paymentService.updatePaymentStatus(
        id as string,
        workspaceId,
        req.body,
      );
      return SuccessResponse(
        res,
        200,
        payment,
        "Payment status updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: customerId } = (req as any).user;
      const { parcelId } = req.params;
      const payments = await paymentService.getMyPayments(
        parcelId as string,
        customerId,
      );
      return SuccessResponse(
        res,
        200,
        payments,
        "Your payment history fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyActivePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: customerId } = (req as any).user;
      const { parcelId } = req.params;
      const payment = await paymentService.getMyActivePayment(
        parcelId as string,
        customerId,
      );
      return SuccessResponse(
        res,
        200,
        payment,
        "Your active payment fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();

import { db } from "../../core/database";
import { payments, parcels } from "../../core/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "../../core/errors/http.errors";
import {
  CreatePaymentInput,
  UpdatePaymentStatusInput,
} from "../validation/payment.validation";

class PaymentService {
  // =====================
  // ADMIN: Create payment record for a shipment
  // =====================
  async createPayment(data: CreatePaymentInput, workspaceId: string) {
    // Verify parcel belongs to workspace
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, data.parcelId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found in your workspace");
    }

    // Block only if already SUCCESSFULLY paid
    const successfulPayment = await db.query.payments.findFirst({
      where: and(
        eq(payments.parcelId, data.parcelId),
        eq(payments.status, "paid"),
      ),
    });

    if (successfulPayment) {
      throw new BadRequestError(
        "This shipment has already been paid successfully",
      );
    }

    const [newPayment] = await db
      .insert(payments)
      .values({
        parcelId: data.parcelId,
        amount: data.amount,
        currency: data.currency ?? "INR",
        notes: data.notes,
        status: "pending",
      })
      .returning();

    return newPayment;
  }

  // =====================
  // ADMIN: Get payment by its own ID
  // =====================
  async getPaymentById(paymentId: string, workspaceId: string) {
    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
      with: {
        parcel: {
          columns: {
            id: true,
            trackingNumber: true,
            recipientName: true,
            status: true,
            workspaceId: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    // Workspace guard via parcel
    if (payment.parcel.workspaceId !== workspaceId) {
      throw new NotFoundError("Payment not found");
    }

    return payment;
  }

  // =====================
  // ADMIN: Get all payment attempts for a parcel
  // =====================
  async getPaymentsByParcelId(parcelId: string, workspaceId: string) {
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, parcelId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found");
    }

    const paymentList = await db.query.payments.findMany({
      where: eq(payments.parcelId, parcelId),
      orderBy: [desc(payments.createdAt)],
    });

    return paymentList;
  }

  // =====================
  // ADMIN: Get active (paid or latest) payment for a parcel
  // =====================
  async getActivePaymentByParcelId(parcelId: string, workspaceId: string) {
    const parcel = await db.query.parcels.findFirst({
      where: and(
        eq(parcels.id, parcelId),
        eq(parcels.workspaceId, workspaceId),
      ),
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found");
    }

    // Prefer paid payment
    const paidPayment = await db.query.payments.findFirst({
      where: and(eq(payments.parcelId, parcelId), eq(payments.status, "paid")),
      with: {
        parcel: {
          columns: {
            id: true,
            trackingNumber: true,
            recipientName: true,
            status: true,
          },
        },
      },
    });

    if (paidPayment) return paidPayment;

    // Fallback: latest attempt
    const latestPayment = await db.query.payments.findFirst({
      where: eq(payments.parcelId, parcelId),
      orderBy: [desc(payments.createdAt)],
      with: {
        parcel: {
          columns: {
            id: true,
            trackingNumber: true,
            recipientName: true,
            status: true,
          },
        },
      },
    });

    if (!latestPayment) {
      throw new NotFoundError("No payment found for this shipment");
    }

    return latestPayment;
  }

  // =====================
  // ADMIN: List all payments in workspace (paginated)
  // =====================
  async listPayments(
    workspaceId: string,
    page: number,
    limit: number,
    status?: string,
  ) {
    const offset = (page - 1) * limit;

    // Get all parcel IDs for this workspace
    const workspaceParcels = await db.query.parcels.findMany({
      where: eq(parcels.workspaceId, workspaceId),
      columns: { id: true },
    });

    const parcelIds = workspaceParcels.map((p) => p.id);

    if (parcelIds.length === 0) {
      return { payments: [], page, limit };
    }

    const paymentList = await db.query.payments.findMany({
      where: status ? eq(payments.status, status as any) : undefined,
      orderBy: [desc(payments.createdAt)],
      limit,
      offset,
      with: {
        parcel: {
          columns: {
            id: true,
            trackingNumber: true,
            recipientName: true,
            status: true,
          },
        },
      },
    });

    // Filter to workspace only
    const filtered = paymentList.filter((p) => parcelIds.includes(p.parcelId));

    return { payments: filtered, page, limit };
  }

  // =====================
  // ADMIN: Update payment status
  // =====================
  async updatePaymentStatus(
    paymentId: string,
    workspaceId: string,
    data: UpdatePaymentStatusInput,
  ) {
    const payment = await this.getPaymentById(paymentId, workspaceId);

    // Guard: cannot revert a paid payment to pending
    if (payment.status === "paid" && data.status === "pending") {
      throw new BadRequestError("Cannot revert a paid payment back to pending");
    }

    // Guard: cannot update a refunded payment
    if (payment.status === "refunded") {
      throw new BadRequestError("Cannot update a refunded payment");
    }

    const [updatedPayment] = await db
      .update(payments)
      .set({
        status: data.status,
        ...(data.gatewayTransactionId && {
          gatewayTransactionId: data.gatewayTransactionId,
        }),
        ...(data.notes && { notes: data.notes }),
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning();

    return updatedPayment;
  }

  // =====================
  // CUSTOMER: Get all their payment attempts for a parcel
  // =====================
  async getMyPayments(parcelId: string, customerId: string) {
    const parcel = await db.query.parcels.findFirst({
      where: and(eq(parcels.id, parcelId), eq(parcels.senderId, customerId)),
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found");
    }

    const paymentList = await db.query.payments.findMany({
      where: eq(payments.parcelId, parcelId),
      orderBy: [desc(payments.createdAt)],
    });

    return paymentList;
  }

  // =====================
  // CUSTOMER: Get active (paid or latest) payment for a parcel
  // =====================
  async getMyActivePayment(parcelId: string, customerId: string) {
    const parcel = await db.query.parcels.findFirst({
      where: and(eq(parcels.id, parcelId), eq(parcels.senderId, customerId)),
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found");
    }

    // Prefer paid
    const paidPayment = await db.query.payments.findFirst({
      where: and(eq(payments.parcelId, parcelId), eq(payments.status, "paid")),
    });

    if (paidPayment) return paidPayment;

    // Fallback: latest attempt
    const latestPayment = await db.query.payments.findFirst({
      where: eq(payments.parcelId, parcelId),
      orderBy: [desc(payments.createdAt)],
    });

    if (!latestPayment) {
      throw new NotFoundError("No payment found for this shipment");
    }

    return latestPayment;
  }
}

export const paymentService = new PaymentService();

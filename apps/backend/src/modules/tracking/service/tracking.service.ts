import { db } from "../../core/database";
import { parcels, trackingEvents } from "../../core/database/schema";
import { eq, desc } from "drizzle-orm";
import { NotFoundError } from "../../core/errors/http.errors";

class TrackingService {
  async trackByTrackingNumber(trackingNumber: string) {
    const parcel = await db.query.parcels.findFirst({
      where: eq(parcels.trackingNumber, trackingNumber),
      with: {
        events: {
          orderBy: [desc(trackingEvents.timestamp)],
        },
        sender: {
          columns: { name: true },
        },
        driver: {
          columns: { id: true, name: true },
        },
      },
    });

    if (!parcel) {
      throw new NotFoundError(
        `No shipment found with tracking number: ${trackingNumber}`,
      );
    }

    // Shape a clean public response — no sensitive internal data
    return {
      trackingNumber: parcel.trackingNumber,
      currentStatus: parcel.status,
      estimatedDelivery: parcel.estimatedDelivery,
      recipient: {
        name: parcel.recipientName,
        address: parcel.recipientAddress,
      },
      assignedAgent: parcel.driver ? { name: parcel.driver.name } : null,
      history: parcel.events.map((event) => ({
        status: event.status,
        location: event.location,
        description: event.description,
        timestamp: event.timestamp,
      })),
    };
  }
}

export const trackingService = new TrackingService();

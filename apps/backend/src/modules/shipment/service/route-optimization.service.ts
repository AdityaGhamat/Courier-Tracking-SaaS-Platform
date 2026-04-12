import { db } from "../../core/database";
import { parcels } from "../../core/database/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NotFoundError } from "../../core/errors/http.errors";
import { haversineDistance } from "../utility/haversine.utility";
import { geocodeAddress } from "../utility/geoencode.utility";
import { nearestNeighborRoute } from "../utility/near-neighbours.utility";

class RouteOptimizationService {
  async getOptimizedRoute(
    agentId: string,
    workspaceId: string,
    hubLat: number,
    hubLng: number,
  ) {
    const agentParcels = await db.query.parcels.findMany({
      where: and(
        eq(parcels.driverId, agentId),
        eq(parcels.workspaceId, workspaceId),
        inArray(parcels.status, ["in_transit", "out_for_delivery"]),
      ),
      columns: {
        id: true,
        trackingNumber: true,
        recipientName: true,
        recipientAddress: true,
        recipientPhone: true,
        status: true,
      },
    });

    if (!agentParcels.length) {
      throw new NotFoundError("No active deliveries found for this agent");
    }

    const geocoded = await Promise.all(
      agentParcels.map(async (parcel) => {
        const coords = await geocodeAddress(parcel.recipientAddress);
        return { ...parcel, ...coords };
      }),
    );

    // filter out any that failed geocoding
    const validStops = geocoded.filter(
      (s): s is typeof s & { lat: number; lng: number } =>
        s.lat !== undefined && s.lng !== undefined,
    );

    if (!validStops.length) {
      throw new NotFoundError("Could not geocode any delivery addresses");
    }

    const optimizedRoute = nearestNeighborRoute(validStops, hubLat, hubLng);

    let totalDistanceKm = 0;
    let prevLat = hubLat;
    let prevLng = hubLng;

    const routeWithDistance = optimizedRoute.map((stop, index) => {
      const distFromPrev = haversineDistance(
        prevLat,
        prevLng,
        stop.lat,
        stop.lng,
      );
      totalDistanceKm += distFromPrev;
      prevLat = stop.lat;
      prevLng = stop.lng;

      return {
        order: index + 1,
        shipmentId: stop.id,
        trackingNumber: stop.trackingNumber,
        recipientName: stop.recipientName,
        recipientAddress: stop.recipientAddress,
        recipientPhone: stop.recipientPhone,
        status: stop.status,
        coordinates: { lat: stop.lat, lng: stop.lng },
        distanceFromPreviousStopKm: parseFloat(distFromPrev.toFixed(2)),
      };
    });

    return {
      agentId,
      totalStops: routeWithDistance.length,
      totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
      startingPoint: { lat: hubLat, lng: hubLng },
      optimizedRoute: routeWithDistance,
    };
  }
}

export const routeOptimizationService = new RouteOptimizationService();

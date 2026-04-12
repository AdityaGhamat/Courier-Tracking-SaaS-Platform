import { haversineDistance } from "./haversine.utility";

export function nearestNeighborRoute<T extends { lat: number; lng: number }>(
  stops: T[],
  startLat: number,
  startLng: number,
): T[] {
  const remaining = [...stops];
  const route: T[] = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        currentLat,
        currentLng,
        remaining[i].lat,
        remaining[i].lng,
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const nearest = remaining.splice(nearestIdx, 1)[0];
    route.push(nearest);
    currentLat = nearest.lat;
    currentLng = nearest.lng;
  }

  return route;
}

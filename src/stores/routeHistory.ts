import { defineStore } from 'pinia';
import type { FeatureCollection, LineString } from 'geojson';
import type { GPSCoords } from 'src/interface';
import * as turf from '@turf/turf';

interface RouteOverlayItem {
  routeID: number;
  points: Array<GPSCoords>;
  lengthMeters: number;
}

export const useRouteHistoryStore = defineStore('routeHistory', {
  state: () => ({
    routes: {} as Record<number, RouteOverlayItem>,
  }),
  getters: {
    isVisible: (state) => {
      return (routeID: number) => Boolean(state.routes[routeID]);
    },
    byID: (state) => {
      return (routeID: number) => state.routes[routeID];
    },
    featureCollection: (state): FeatureCollection<LineString> => {
      return {
        type: 'FeatureCollection',
        features: Object.values(state.routes)
          .filter((item) => item.points.length > 1)
          .map((item) => ({
            type: 'Feature',
            id: item.routeID,
            properties: {
              routeID: item.routeID,
            },
            geometry: {
              type: 'LineString',
              coordinates: item.points.map((point) => [point.lng, point.lat]),
            },
          })),
      };
    },
  },
  actions: {
    setRoute(routeID: number, points: Array<GPSCoords>) {
      const coordinates = points.map((point) => [point.lng, point.lat]);
      const lengthMeters =
        coordinates.length > 1
          ? turf.length(turf.lineString(coordinates), { units: 'kilometers' }) * 1000
          : 0;

      this.routes[routeID] = {
        routeID,
        points,
        lengthMeters,
      };
    },
    removeRoute(routeID: number) {
      delete this.routes[routeID];
    },
    toggleRoute(routeID: number, points?: Array<GPSCoords>) {
      if (this.routes[routeID]) {
        this.removeRoute(routeID);
        return false;
      }
      if (points && points.length > 1) {
        this.setRoute(routeID, points);
        return true;
      }
      return false;
    },
    clearRoutes() {
      this.routes = {};
    },
  },
});

export type RouteHistoryStore = ReturnType<typeof useRouteHistoryStore>;

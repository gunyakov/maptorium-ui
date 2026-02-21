import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { defineStore } from 'pinia';

export const usePOIStore = defineStore('poi', {
  state: () => ({
    drawings: [] as Array<Feature<Geometry, GeoJsonProperties>>,
    counters: {
      polygon: 0,
      polyline: 0,
      point: 0,
    },
    style: {
      drawActiveColor: '#26a69a',
      polygonColor: '#3bb2d0',
      polygonFillColor: '#3bb2d0',
      polygonFillOpacity: 0.3,
      polygonBorderWidth: 2,
    },
  }),
  actions: {
    setDrawings(features: Array<Feature<Geometry, GeoJsonProperties>>) {
      this.drawings = features;
    },
    addDrawing(feature: Feature<Geometry, GeoJsonProperties>) {
      this.drawings.push(feature);
    },
    addDrawings(features: Array<Feature<Geometry, GeoJsonProperties>>) {
      this.drawings.push(...features);
    },
    nextPOIName(geometryType: Geometry['type']) {
      if (geometryType === 'Polygon') {
        this.counters.polygon += 1;
        return `Polygon${String(this.counters.polygon).padStart(4, '0')}`;
      }
      if (geometryType === 'LineString') {
        this.counters.polyline += 1;
        return `Polyline${String(this.counters.polyline).padStart(4, '0')}`;
      }
      if (geometryType === 'Point') {
        this.counters.point += 1;
        return `Point${String(this.counters.point).padStart(4, '0')}`;
      }
      return '';
    },
    clearDrawings() {
      this.drawings = [];
    },
    setStyle(value: {
      drawActiveColor: string;
      polygonColor: string;
      polygonFillColor: string;
      polygonFillOpacity: number;
      polygonBorderWidth: number;
    }) {
      this.style = value;
    },
  },
  persist: true,
});

export type POIStore = ReturnType<typeof usePOIStore>;

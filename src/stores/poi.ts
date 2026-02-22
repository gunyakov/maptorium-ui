import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { defineStore } from 'pinia';

export interface POIFolderItem {
  ID: number;
  name: string;
  parentID: number | null;
}

export type POIFeatureProperties = (GeoJsonProperties extends null
  ? Record<string, unknown>
  : NonNullable<GeoJsonProperties>) & {
  name?: string;
  folderID?: number | null;
};

export type POIFeature = Feature<Geometry, POIFeatureProperties>;

function normalizeDrawingFeature(feature: Feature<Geometry, GeoJsonProperties>): POIFeature {
  const normalized = feature as POIFeature;
  const properties = normalized.properties ?? {};
  if (!Object.prototype.hasOwnProperty.call(properties, 'folderID')) {
    properties.folderID = null;
  }
  normalized.properties = properties;
  return normalized;
}

export const usePOIStore = defineStore('poi', {
  state: () => ({
    drawings: [] as Array<POIFeature>,
    folders: [] as Array<POIFolderItem>,
    folderCounter: 0,
    counters: {
      polygon: 0,
      polyline: 0,
      route: 0,
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
      this.drawings = features.map((feature) => normalizeDrawingFeature(feature));
    },
    addDrawing(feature: Feature<Geometry, GeoJsonProperties>) {
      this.drawings.push(normalizeDrawingFeature(feature));
    },
    addDrawings(features: Array<Feature<Geometry, GeoJsonProperties>>) {
      this.drawings.push(...features.map((feature) => normalizeDrawingFeature(feature)));
    },
    setFolders(folders: Array<POIFolderItem>) {
      this.folders = folders;
      const maxFolderID = folders.reduce((maxID, item) => Math.max(maxID, item.ID), 0);
      this.folderCounter = Math.max(this.folderCounter, maxFolderID);
    },
    addFolder(name: string, parentID: number | null = null) {
      this.folderCounter += 1;
      const folder: POIFolderItem = {
        ID: this.folderCounter,
        name,
        parentID,
      };
      this.folders.push(folder);
      return folder;
    },
    renameFolder(folderID: number, name: string) {
      const folder = this.folders.find((item) => item.ID === folderID);
      if (!folder) return false;
      folder.name = name;
      return true;
    },
    moveFolder(folderID: number, targetParentID: number | null) {
      const folder = this.folders.find((item) => item.ID === folderID);
      if (!folder) return false;
      if (targetParentID === folderID) return false;

      if (typeof targetParentID === 'number') {
        const targetFolder = this.folders.find((item) => item.ID === targetParentID);
        if (!targetFolder) return false;

        const descendantIDs = this.getFolderDescendantIDs(folderID);
        if (descendantIDs.includes(targetParentID)) return false;
      }

      folder.parentID = targetParentID;
      return true;
    },
    deleteFolder(folderID: number) {
      const folder = this.folders.find((item) => item.ID === folderID);
      if (!folder) return false;

      const nextParentID = folder.parentID;

      this.folders = this.folders.map((item) => {
        if (item.parentID === folderID) {
          return {
            ...item,
            parentID: nextParentID,
          };
        }
        return item;
      });

      this.drawings = this.drawings.map((feature) => {
        const featureFolderID =
          typeof feature.properties?.folderID === 'number' ? feature.properties.folderID : null;
        if (featureFolderID !== folderID) return feature;

        return {
          ...feature,
          properties: {
            ...(feature.properties ?? {}),
            folderID: nextParentID,
          },
        };
      });

      this.folders = this.folders.filter((item) => item.ID !== folderID);
      return true;
    },
    getFolderDescendantIDs(folderID: number) {
      const descendants: Array<number> = [];
      const queue: Array<number> = [folderID];

      while (queue.length > 0) {
        const current = queue.shift();
        if (typeof current !== 'number') continue;

        const children = this.folders
          .filter((item) => item.parentID === current)
          .map((item) => item.ID);
        descendants.push(...children);
        queue.push(...children);
      }

      return descendants;
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
    nextRouteName() {
      if (typeof this.counters.route !== 'number') this.counters.route = 0;
      this.counters.route += 1;
      return `Route${String(this.counters.route).padStart(4, '0')}`;
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

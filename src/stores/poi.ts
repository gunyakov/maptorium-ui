import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { defineStore } from 'pinia';
import { generateUUID, isUUID } from 'src/helpers/uuid';

export interface POIFolderItem {
  ID: string;
  name: string;
  parentID: string | null;
}

export type POIFeatureProperties = (GeoJsonProperties extends null
  ? Record<string, unknown>
  : NonNullable<GeoJsonProperties>) & {
  name?: string;
  folderID?: string | null;
  visible?: number;
};

export type POIFeature = Feature<Geometry, POIFeatureProperties>;

function normalizeFolderID(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function normalizeFeatureID(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    if (isUUID(value)) return value;
    if (Number.isFinite(Number(value))) return generateUUID();
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return generateUUID();
  return generateUUID();
}

function normalizeVisibility(value: unknown): number {
  if (value === false) return 0;
  if (value === true) return 1;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return parsed === 0 ? 0 : 1;
}

function normalizeDrawingFeature(feature: Feature<Geometry, GeoJsonProperties>): POIFeature {
  const normalized = feature as POIFeature;
  const properties = normalized.properties ?? {};
  normalized.id = normalizeFeatureID(normalized.id);

  if (!Object.prototype.hasOwnProperty.call(properties, 'folderID')) {
    properties.folderID = null;
  } else {
    properties.folderID = normalizeFolderID(properties.folderID);
  }

  if (!Object.prototype.hasOwnProperty.call(properties, 'visible')) {
    properties.visible = 1;
  } else {
    properties.visible = normalizeVisibility(properties.visible);
  }

  normalized.properties = properties;
  return normalized;
}

export const usePOIStore = defineStore('poi', {
  state: () => ({
    drawings: [] as Array<POIFeature>,
    folders: [] as Array<POIFolderItem>,
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
      this.folders = folders.map((item) => ({
        ...item,
        ID: normalizeFeatureID(item.ID),
        parentID: normalizeFolderID(item.parentID),
      }));

      this.ensureUUIDIDs();
    },
    addFolder(name: string, parentID: string | null = null) {
      const folder: POIFolderItem = {
        ID: generateUUID(),
        name,
        parentID: normalizeFolderID(parentID),
      };
      this.folders.push(folder);
      return folder;
    },
    renameFolder(folderID: string, name: string) {
      const folder = this.folders.find((item) => item.ID === folderID);
      if (!folder) return false;
      folder.name = name;
      return true;
    },
    moveFolder(folderID: string, targetParentID: string | null) {
      const folder = this.folders.find((item) => item.ID === folderID);
      if (!folder) return false;
      if (targetParentID === folderID) return false;

      if (typeof targetParentID === 'string') {
        const targetFolder = this.folders.find((item) => item.ID === targetParentID);
        if (!targetFolder) return false;

        const descendantIDs = this.getFolderDescendantIDs(folderID);
        if (descendantIDs.includes(targetParentID)) return false;
      }

      folder.parentID = targetParentID;
      return true;
    },
    deleteFolder(folderID: string) {
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
        const featureFolderID = normalizeFolderID(feature.properties?.folderID);
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
    getFolderDescendantIDs(folderID: string) {
      const descendants: Array<string> = [];
      const queue: Array<string> = [folderID];

      while (queue.length > 0) {
        const current = queue.shift();
        if (typeof current !== 'string') continue;

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
    ensureUUIDIDs() {
      const folderIDMap = new Map<string, string>();

      this.folders = this.folders.map((folder) => {
        const legacyID = String(folder.ID);
        const nextID = normalizeFeatureID(folder.ID);
        if (legacyID !== nextID) {
          folderIDMap.set(legacyID, nextID);
        }

        return {
          ...folder,
          ID: nextID,
          parentID: normalizeFolderID(folder.parentID),
        };
      });

      this.folders = this.folders.map((folder) => {
        const parentID = normalizeFolderID(folder.parentID);
        if (parentID == null) {
          return {
            ...folder,
            parentID: null,
          };
        }

        return {
          ...folder,
          parentID: folderIDMap.get(parentID) ?? parentID,
        };
      });

      this.drawings = this.drawings.map((item) => {
        const normalized = normalizeDrawingFeature(item);
        const rawFolderID = normalizeFolderID(normalized.properties?.folderID);

        const nextFolderID =
          rawFolderID == null ? null : (folderIDMap.get(rawFolderID) ?? rawFolderID);

        return {
          ...normalized,
          properties: {
            ...(normalized.properties ?? {}),
            folderID: nextFolderID,
          },
        };
      });
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

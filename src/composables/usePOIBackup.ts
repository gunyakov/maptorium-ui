import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import Alerts from 'src/alerts';
import { ModalsList, useDialogs } from 'src/composables/useDialogs';
import { generateUUID, isUUID } from 'src/helpers/uuid';
import type { POIFeature, POIFolderItem } from 'src/stores/poi';
import { usePOIStore } from 'src/stores/poi';

interface POIBackupFile {
  folders: Array<POIFolderItem>;
  geojson: FeatureCollection<Geometry, GeoJsonProperties>;
}

interface POIConflictResolution {
  rewrite: boolean;
  applyForAll: boolean;
}

interface ImportedFolderTemp {
  ID: string;
  name: string;
  parentID: string | null;
}

function normalizeToUUID(value: unknown) {
  if (typeof value === 'string' && isUUID(value)) return value;
  return generateUUID();
}

function normalizeFolderID(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function formatBackupFileName() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${datePart}_${timePart}.mpb`;
}

function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isFeatureCollection(
  value: unknown,
): value is FeatureCollection<Geometry, GeoJsonProperties> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<FeatureCollection<Geometry, GeoJsonProperties>>;
  return candidate.type === 'FeatureCollection' && Array.isArray(candidate.features);
}

function toBackupFile(value: unknown): POIBackupFile | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as {
    folders?: unknown;
    geojson?: unknown;
  };

  if (!Array.isArray(candidate.folders)) return null;
  if (!isFeatureCollection(candidate.geojson)) return null;

  const folders = candidate.folders
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      ID: normalizeToUUID(item.ID),
      name:
        typeof item.name === 'string' && item.name.trim().length > 0 ? item.name.trim() : 'Folder',
      parentID: normalizeFolderID(item.parentID),
    }));

  return {
    folders,
    geojson: candidate.geojson,
  };
}

function normalizeImportedFeature(feature: POIFeature, folderMap: Map<string, string>): POIFeature {
  const nextID = normalizeToUUID(feature.id);
  const rawFolderID = normalizeFolderID(feature.properties?.folderID);
  const mappedFolderID = rawFolderID == null ? null : (folderMap.get(rawFolderID) ?? rawFolderID);

  return {
    ...feature,
    id: nextID,
    properties: {
      ...(feature.properties ?? {}),
      folderID: mappedFolderID,
    },
  };
}

export const usePOIBackup = () => {
  const dialogs = useDialogs();
  const poiStore = usePOIStore();

  const exportBackup = () => {
    poiStore.ensureUUIDIDs();

    const payload: POIBackupFile = {
      folders: poiStore.folders.map((item) => ({
        ID: item.ID,
        name: item.name,
        parentID: item.parentID,
      })),
      geojson: {
        type: 'FeatureCollection',
        features: poiStore.drawings.map((item) => ({
          ...item,
          id: normalizeToUUID(item.id),
          properties: {
            ...(item.properties ?? {}),
            folderID: normalizeFolderID(item.properties?.folderID),
          },
        })),
      },
    };

    downloadTextFile(JSON.stringify(payload, null, 2), formatBackupFileName());
    Alerts.success('toast.poi_backup.export_done');
  };

  const importBackup = async () => {
    const backupFile = (await dialogs(ModalsList.POIBackupImportFile)) as false | File;
    if (!backupFile) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(await backupFile.text());
    } catch {
      Alerts.error('toast.poi_backup.invalid_file');
      return;
    }

    const backup = toBackupFile(parsed);
    if (!backup) {
      Alerts.error('toast.poi_backup.invalid_file');
      return;
    }

    poiStore.ensureUUIDIDs();

    const folderIDMap = new Map<string, string>();
    const pendingFolders: Array<ImportedFolderTemp> = [];
    const existingFolderIDs = new Set(poiStore.folders.map((item) => item.ID));

    backup.folders.forEach((folder) => {
      const sourceID = String(folder.ID);
      const nextID = normalizeToUUID(folder.ID);
      folderIDMap.set(sourceID, nextID);

      pendingFolders.push({
        ID: nextID,
        name: folder.name,
        parentID: normalizeFolderID(folder.parentID),
      });
    });

    const collisionFolderIDs = new Set<string>();
    pendingFolders.forEach((folder) => {
      if (existingFolderIDs.has(folder.ID)) {
        collisionFolderIDs.add(folder.ID);
      }
    });

    let unresolvedFolders = pendingFolders
      .filter((folder) => !collisionFolderIDs.has(folder.ID))
      .map((folder) => ({
        ...folder,
        parentID:
          folder.parentID == null ? null : (folderIDMap.get(folder.parentID) ?? folder.parentID),
      }));

    while (unresolvedFolders.length > 0) {
      const deferred: Array<ImportedFolderTemp> = [];
      let progress = false;

      unresolvedFolders.forEach((folder) => {
        if (folder.parentID == null || existingFolderIDs.has(folder.parentID)) {
          poiStore.folders.push({
            ID: folder.ID,
            name: folder.name,
            parentID: folder.parentID,
          });
          existingFolderIDs.add(folder.ID);
          progress = true;
          return;
        }

        deferred.push(folder);
      });

      if (!progress) {
        deferred.forEach((folder) => {
          poiStore.folders.push({
            ID: folder.ID,
            name: folder.name,
            parentID: null,
          });
          existingFolderIDs.add(folder.ID);
        });
        break;
      }

      unresolvedFolders = deferred;
    }

    let rewriteAllDecision: boolean | null = null;

    const nextDrawings = [...poiStore.drawings];
    for (const rawFeature of backup.geojson.features) {
      const importedFeature = normalizeImportedFeature(rawFeature as POIFeature, folderIDMap);
      const featureFolderID = normalizeFolderID(importedFeature.properties?.folderID);
      if (featureFolderID != null && !existingFolderIDs.has(featureFolderID)) {
        importedFeature.properties = {
          ...(importedFeature.properties ?? {}),
          folderID: null,
        };
      }

      const importedID = String(importedFeature.id);
      const matchedIndex = nextDrawings.findIndex((item) => String(item.id) === importedID);
      if (matchedIndex < 0) {
        nextDrawings.push(importedFeature);
        continue;
      }

      let rewrite = false;
      if (rewriteAllDecision == null) {
        const poiName =
          typeof importedFeature.properties?.name === 'string'
            ? importedFeature.properties.name
            : importedID;

        const decision = (await dialogs(ModalsList.POIBackupConflict, {
          poiName,
        })) as false | POIConflictResolution;

        if (!decision) return;

        rewrite = decision.rewrite;
        if (decision.applyForAll) {
          rewriteAllDecision = decision.rewrite;
        }
      } else {
        rewrite = rewriteAllDecision;
      }

      if (rewrite) {
        nextDrawings[matchedIndex] = importedFeature;
      }
    }

    poiStore.setDrawings(nextDrawings);
    Alerts.success('toast.poi_backup.import_done');
  };

  return {
    exportBackup,
    importBackup,
  };
};

export type POIBackup = ReturnType<typeof usePOIBackup>;

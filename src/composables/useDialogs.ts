import { Dialog } from 'quasar';
import GPSConfig from 'src/components/dialogs/GPSConfig.vue';
import DistanceToGO from 'src/components/dialogs/DistanceToGO.vue';
import GPSRouteFromFile from 'src/components/dialogs/GPSRouteFromFile.vue';
import POIMove from 'src/components/dialogs/POIMove.vue';
import Job from 'src/components/dialogs/Job.vue';
import POIProperties from 'src/components/dialogs/POIProperties.vue';
import FileSystemTree from 'src/components/dialogs/FileSystemTree.vue';
import type { Component } from 'vue';

export enum ModalsList {
  POIConfig = 'poi.properties',
  CategoryConfig = 'category.properties',
  CachedMap = 'cached_map.main',
  DistanceToGO = 'gps.distance_to_go',
  GPSConfig = 'gps.config',
  GPSRouteFromFile = 'gps.route_from_file',
  POIMove = 'poi.move',
  Job = 'job.main',
  FileTree = 'filesystem_tree',
}

type DialogPayload = Record<string, unknown>;

interface ModalConfig {
  component: Component;
}

const modalRegistry: Record<ModalsList, ModalConfig> = {
  [ModalsList.POIConfig]: { component: POIProperties },
  [ModalsList.CategoryConfig]: { component: GPSConfig },
  [ModalsList.CachedMap]: { component: GPSConfig },
  [ModalsList.DistanceToGO]: { component: DistanceToGO },
  [ModalsList.GPSConfig]: { component: GPSConfig },
  [ModalsList.GPSRouteFromFile]: { component: GPSRouteFromFile },
  [ModalsList.POIMove]: { component: POIMove },
  [ModalsList.Job]: { component: Job },
  [ModalsList.FileTree]: { component: FileSystemTree },
};

export const useDialogs = () => {
  const run = async (modalName: ModalsList, payload: DialogPayload = {}) => {
    const modalConfig = modalRegistry[modalName];

    return new Promise((resolve) => {
      Dialog.create({
        component: modalConfig.component,
        componentProps: {
          modalName,
          ...payload,
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          resolve(data.data);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };

  return run;
};

//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type Dialogs = ReturnType<typeof useDialogs>;

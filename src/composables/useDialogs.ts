import { Dialog } from 'quasar';
import GPSConfig from 'src/components/dialogs/GPSConfig.vue';
import DistanceToGO from 'src/components/dialogs/DistanceToGO.vue';
import type { Component } from 'vue';

export enum ModalsList {
  POIConfig = 'poi.properties',
  CategoryConfig = 'category.properties',
  CachedMap = 'cached_map.main',
  DistanceToGO = 'gps.distance_to_go',
  GPSConfig = 'gps.config',
  GPSRouteFromFile = 'gps.route_from_file',
}

type DialogPayload = Record<string, unknown>;

interface ModalConfig {
  component: Component;
}

const modalRegistry: Record<ModalsList, ModalConfig> = {
  [ModalsList.POIConfig]: { component: GPSConfig },
  [ModalsList.CategoryConfig]: { component: GPSConfig },
  [ModalsList.CachedMap]: { component: GPSConfig },
  [ModalsList.DistanceToGO]: { component: DistanceToGO },
  [ModalsList.GPSConfig]: { component: GPSConfig },
  [ModalsList.GPSRouteFromFile]: { component: GPSConfig },
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

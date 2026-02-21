//--------------------------------------------------------------------------
//Import vue
//--------------------------------------------------------------------------
import { type Ref, ref } from 'vue';
//--------------------------------------------------------------------------
//Import API and types
//--------------------------------------------------------------------------
import request from 'src/API/ajax';
import type { iMapItem } from 'src/interface';
import { eMapType } from 'src/enum';
//--------------------------------------------------------------------------
//Import stores and composables
//--------------------------------------------------------------------------
import { useMapLayersStore } from 'src/stores/layers';
//--------------------------------------------------------------------------
//Reactive variables to store maps list and current base map
//--------------------------------------------------------------------------
const rawMapsList: Ref<Array<iMapItem>> = ref([]);
const currentBaseMap: Ref<string> = ref('');
const mapsListMenu: Ref<{ [id: string]: Array<iMapItem> | iMapItem }> = ref({});
const layersListMenu: Ref<{ [id: string]: Array<iMapItem> | iMapItem }> = ref({});
const layers: Ref<Array<iMapItem>> = ref([]);
//--------------------------------------------------------------------------
//Composable for managing maps list and current base map
//--------------------------------------------------------------------------
export const useMapsList = () => {
  //------------------------------------------------------------------------
  // Composable for managing maps list and current base map
  //------------------------------------------------------------------------
  const layersStore = useMapLayersStore();
  //Get from persistent storage current base map
  currentBaseMap.value = layersStore.baseLayer;
  //------------------------------------------------------------------------
  //Get full maps list from server
  //------------------------------------------------------------------------
  const refresh = async (): Promise<void> => {
    const data = (await request('core.maps', {}, 'get')) as false | Array<iMapItem>;
    if (data) {
      rawMapsList.value = data;
      mapsListMenu.value = {};
      layersListMenu.value = {};
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item) continue;
        if (item.type == eMapType.map) {
          if (item.submenu) {
            if (!mapsListMenu.value[item.submenu]) mapsListMenu.value[item.submenu] = [];
            //@ts-expect-error no error mistmatc
            mapsListMenu.value[item.submenu].push(item);
          } else {
            mapsListMenu.value[item.name] = item;
          }
        }
        if (item.type == eMapType.layer) {
          if (item.submenu) {
            if (!layersListMenu.value[item.submenu]) layersListMenu.value[item.submenu] = [];
            //@ts-expect-error no error mistmatc
            layersListMenu.value[item.submenu].push(item);
          } else {
            layersListMenu.value[item.name] = item;
          }
        }
      }
      layers.value = [];
      layersStore.overlayLayers.forEach((item) => {
        const mapInfo = getMapInfo(item);
        if (mapInfo) layers.value.push(mapInfo);
      });
    }
  };
  //------------------------------------------------------------------------
  //Check if map with ID is exist in list
  //------------------------------------------------------------------------
  const checkMapExist = (ID: string) => {
    if (rawMapsList.value.find((item) => item.id == ID)) return true;
    else return false;
  };
  //-------------------------------------------------------------------------
  //Set ID for base map
  //-------------------------------------------------------------------------
  const setBaseMap = (mapID: string | undefined) => {
    if (!mapID) return;
    if (!checkMapExist(mapID)) return;
    currentBaseMap.value = mapID;
    layersStore.setBaseLayer(mapID);
  };
  //------------------------------------------------------------------------
  //Get map info by ID
  //------------------------------------------------------------------------
  const getMapInfo = (ID: string): iMapItem | null => {
    const map = rawMapsList.value.find((item) => item.id == ID);
    return map ? map : null;
  };

  const addLayer = (layerID: string | undefined) => {
    if (!layerID) return;
    const mapInfo = getMapInfo(layerID);
    if (!mapInfo) return;
    if (!isLayer(layerID)) {
      layers.value.push(mapInfo);
      layersStore.addOverlayLayer(layerID);
    }
  };

  const removeLayer = (layerID: string | undefined) => {
    if (!layerID) return false;
    const index = layers.value.findIndex((item) => item.id == layerID);
    if (index == -1) return false;
    layers.value.splice(index, 1);
    layersStore.removeOverlayLayer(layerID);
    return true;
  };

  const toggleLayer = (layerID: string | undefined) => {
    if (!layerID) return;
    const index = layers.value.findIndex((item) => item.id == layerID);
    if (index == -1) {
      addLayer(layerID);
    } else {
      layers.value.splice(index, 1);
      layersStore.removeOverlayLayer(layerID);
    }
  };

  const isLayer = (layerID: string | undefined) => {
    if (!layerID) return false;
    const index = layers.value.findIndex((item) => item.id == layerID);
    if (index == -1) {
      return false;
    } else {
      return true;
    }
  };
  //------------------------------------------------------------------------
  //Return all reactive variables and functions to manage maps list and current base map
  //------------------------------------------------------------------------
  return {
    rawMapsList,
    currentBaseMap,
    mapsListMenu,
    layersListMenu,
    layers,
    setBaseMap,
    getMapInfo,
    refresh,
    addLayer,
    removeLayer,
    toggleLayer,
    isLayer,
  };
};
//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type MapsList = ReturnType<typeof useMapsList>;

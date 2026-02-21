import { defineStore } from 'pinia';
export const useMapLayersStore = defineStore('mapLayers', {
  state: () => ({
    baseLayer: 'arcgissat',
    overlayLayers: [] as string[],
    hideWaterPolygons: true,
  }),
  actions: {
    setBaseLayer(layer: string) {
      this.baseLayer = layer;
    },
    addOverlayLayer(layer: string) {
      if (!this.overlayLayers.includes(layer)) {
        this.overlayLayers.push(layer);
      }
    },
    removeOverlayLayer(layer: string) {
      this.overlayLayers = this.overlayLayers.filter((l) => l !== layer);
    },
    clearOverlayLayers() {
      this.overlayLayers = [];
    },
  },
  persist: true,
});

// Export the type of the store instance
export type MapLayersStore = ReturnType<typeof useMapLayersStore>;

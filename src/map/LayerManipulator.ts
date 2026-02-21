import { requestPath } from 'src/API/ajax';
import { eMapFormat } from 'src/enum';
import type { iMapItem } from 'src/interface';
import { useMapLayersStore } from 'src/stores/layers';
import { useMapsList } from 'src/composables/useMapsList';
import { watch } from 'vue';

/**
 * Layer Manipulator Plugin for MapLibre GL
 * Handles dynamic layer management without UI (can be extended later)
 */
class LayerManipulator implements maplibregl.IControl {
  private _map: maplibregl.Map | undefined = undefined;
  private _container: HTMLDivElement | undefined = undefined;
  private _layers: Array<iMapItem> = [];
  private _baseMap: iMapItem | null = null;
  private _extendStyleID: string = '';
  private _extendStyle: maplibregl.StyleSpecification | null = null;
  private _ignoreWatchChange: boolean = false;

  /**
   * IControl required method - called when control is added to map
   */
  onAdd(map: maplibregl.Map): HTMLElement {
    //Save map instance
    this._map = map;
    //Add base layer on map
    const mapLayersStore = useMapLayersStore();
    this.setBaseMap(mapLayersStore.baseLayer).catch((e) => {
      console.error('Failed to set base map:', e);
    });
    //Watch for changes in current base map and update map style accordingly
    const mapsList = useMapsList();
    watch(mapsList.currentBaseMap, (newMapID: string) => {
      //If basemap setted by class events, ignore new value to prevent recurcive loop
      if (this._ignoreWatchChange) {
        this._ignoreWatchChange = false;
        return;
      }
      this.setBaseMap(newMapID).catch((e) => {
        console.error('Failed to set base map:', e);
      });
    });

    watch(
      () => mapsList.layers.value,
      (newLayers) => {
        //If layers setted by class events, ignore new value to prevent recurcive loop
        if (this._ignoreWatchChange) {
          this._ignoreWatchChange = false;
          return;
        }
        this._layers = [...newLayers];
        this._updateMapStyle();
      },
      { deep: true, immediate: true },
    );
    // Create a container for the control (can be used for UI elements if needed)
    this._container = document.createElement('div');
    // Empty div for now, can add UI elements later if needed
    return this._container;
  }

  /**
   * IControl required method - called when control is removed from map
   */
  onRemove(): void {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }

  public async setBaseMap(mapID: string, style?: string) {
    const mapsList = useMapsList();
    const mapInfo = mapsList.getMapInfo(mapID);
    if (!mapInfo) {
      console.error(`Map with ID ${mapID} does not exist`);
      return;
    }
    let needUpdate = false;
    if (this._baseMap?.id != mapInfo.id) {
      this._baseMap = mapInfo;
      needUpdate = true;
    }
    if (await this._getStyle(style)) needUpdate = true;
    if (needUpdate) this._updateMapStyle();
  }

  public async AddLayer(layerID: string, style?: string) {
    this._ignoreWatchChange = true;
    const mapsList = useMapsList();
    mapsList.addLayer(layerID);
    this._layers = [...mapsList.layers.value];
    await this._getStyle(style);
    this._updateMapStyle();
  }

  public RemoveLayer(layerID: string) {
    this._ignoreWatchChange = true;
    const mapsList = useMapsList();
    const removed = mapsList.removeLayer(layerID);
    if (removed) {
      this._layers = [...mapsList.layers.value];
      this._updateMapStyle();
    }
  }

  private async _getStyle(style = 'bright'): Promise<boolean> {
    if (style != undefined && style != this._extendStyleID) {
      this._extendStyleID = style;
      const jsonStyle = await requestPath<maplibregl.StyleSpecification>(
        `json/${style}/style.json`,
      );
      //If style from server
      if (jsonStyle && typeof jsonStyle === 'object') {
        //Save style
        this._extendStyle = jsonStyle;
      }
      return true;
    }
    return false;
  }
  private _updateMapStyle() {
    if (this._map) {
      console.log('Update map style');

      let anyVectorMap = false;
      //If style from server is
      const mainStyle: maplibregl.StyleSpecification = {
        version: 8,
        name: 'MAPTORIUM',
        metadata: {
          'mapbox:autocomposite': false,
          'mapbox:groups': {
            '1444849242106.713': { collapsed: false, name: 'Places' },
            '1444849334699.1902': { collapsed: true, name: 'Bridges' },
            '1444849345966.4436': { collapsed: false, name: 'Roads' },
            '1444849354174.1904': { collapsed: true, name: 'Tunnels' },
            '1444849364238.8171': { collapsed: false, name: 'Buildings' },
            '1444849382550.77': { collapsed: false, name: 'Water' },
            '1444849388993.3071': { collapsed: false, name: 'Land' },
          },
        },
        center: [0, 0],
        zoom: 1,
        bearing: 0,
        pitch: 0,
        sources: {},
        sprite: `http://localhost/json/${this._extendStyleID}/sprite`,
        glyphs: 'fonts/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#f8f4f0' },
          },
        ],
        sky: {
          'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
        },
        //id: 'MAPTORIUM'
      };
      //If map is raster
      if (this._baseMap?.format == eMapFormat.rasted) {
        //Set tile path for base raster layout
        mainStyle.sources['raster-source'] = {
          type: 'raster',
          tiles: [`tile/${this._baseMap.id}/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 22,
          tileSize: this._baseMap.tileSize,
        };
        //Make base raster map visible
        mainStyle.layers.push({
          id: 'raster-base-layer',
          type: 'raster',
          source: 'raster-source',
          layout: {
            visibility: 'visible',
          },
        });
      }
      const mapLayersStore = useMapLayersStore();
      const hideWater = mapLayersStore.hideWaterPolygons;
      this._layers.forEach((item) => {
        if (item.format == eMapFormat.vector) {
          anyVectorMap = true;

          mainStyle.sources['openmaptiles'] = {
            type: 'vector',
            tiles: [`tile/${item.id}/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 14,
            format: 'pbf',
            pixel_scale: '512',
          };
        }
        if (item.format == eMapFormat.rasted) {
          //Set tile path for base raster layout
          mainStyle.sources[`raster-source-${item.id}`] = {
            type: 'raster',
            tiles: [`tile/${item.id}/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 22,
            tileSize: item.tileSize,
          };
          //Make base raster map visible
          mainStyle.layers.push({
            id: `raster-layer-${item.id}`,
            type: 'raster',
            source: `raster-source-${item.id}`,
            layout: {
              visibility: 'visible',
            },
          });
        }
      });
      //If map is vector
      if (this._baseMap?.format == eMapFormat.vector) {
        mainStyle.sources['openmaptiles'] = {
          type: 'vector',
          tiles: [`tile/${this._baseMap.id}/{z}/{x}/{y}.pbf`],
          minzoom: 0,
          maxzoom: 14,
          format: 'pbf',
          pixel_scale: '256',
        };
        anyVectorMap = true;
      }

      if (this._extendStyle && anyVectorMap) {
        //Add extend style for vector tiles
        for (let cL = 0; cL < this._extendStyle.layers.length; cL++) {
          const item = this._extendStyle.layers[cL];
          if (!item) continue;
          mainStyle.layers.push(item);
          //Set style for map
          // this._map.setStyle(mainStyle)
          // console.log(cL)
          // await wait(200)
        }
      }
      mainStyle.layers.forEach((value, index) => {
        if (value['source-layer'] == 'water' && hideWater == true) {
          //@ts-expect-error no error mistmatc
          mainStyle.layers[index].layout.visibility = 'none';
        }
      });
      //console.log(mainStyle);
      //Set style for map
      this._map.setStyle(mainStyle);
    }
  }
}

// Export singleton instance
export const layerManipulator = new LayerManipulator();

// Also export the class for type checking
export default LayerManipulator;

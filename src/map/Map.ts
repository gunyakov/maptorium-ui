//--------------------------------------------------------------------------
//Import stores and composables
//--------------------------------------------------------------------------
import { type SettingsStore, useSettingsStore } from 'src/stores/settings';
import { useRouteHistoryStore, type RouteHistoryStore } from 'src/stores/routeHistory';
import { usePOIStore, type POIStore } from 'src/stores/poi';
import {
  useRouteHoverMeasure,
  type RouteHoverMeasureStore,
} from 'src/composables/useRouteHoverMeasure';
import Routes from 'src/API/Routes';
import { DistanceUnits } from 'src/enum';

import { layerManipulator } from 'src/map/LayerManipulator';
import { drawer } from 'src/map/Drawer';
import TileGrid from 'src/map/TileGrid';
import CachedMap from 'src/map/CachedMap';
import { setInfoBarCoords, setInfoBarZoom } from 'src/composables/useInfoBar';

const ROUTE_HISTORY_SOURCE_ID = 'gps-route-history-source';
const ROUTE_HISTORY_LAYER_MAIN_ID = 'gps-route-history-line-main';
const ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID = 'gps-route-history-line-hover-outline';
const ROUTE_HISTORY_LAYER_HOVER_MAIN_ID = 'gps-route-history-line-hover-main';
const NO_HOVER_ROUTE_ID = -1;
//--------------------------------------------------------------------------
//Map class to handle all nessesary functions
//--------------------------------------------------------------------------
class MaptoriumMap {
  private _map: maplibregl.Map | null = null;
  private _mapMoveCount: number = 0;
  private _config: SettingsStore;
  private _routeHistory: RouteHistoryStore;
  private _poiStore: POIStore;
  private _routeHoverMeasure: RouteHoverMeasureStore;
  private _hoveredRouteID: number | null = null;
  private _unsubscribeRouteHistory: (() => void) | null = null;
  private _styleDataHandler: (() => void) | null = null;
  private _mouseMoveHandler: ((event: maplibregl.MapMouseEvent) => void) | null = null;
  private _mouseOutHandler: (() => void) | null = null;

  constructor() {
    this._config = useSettingsStore();
    this._routeHistory = useRouteHistoryStore();
    this._poiStore = usePOIStore();
    this._routeHoverMeasure = useRouteHoverMeasure();
  }
  /**
   * Map initialization
   */
  public init(): maplibregl.Map | null {
    //------------------------------------------------------------------------
    // Initialize the map
    //------------------------------------------------------------------------
    if (!this._map) {
      //Alerts.info(stylePath);
      this._map = new maplibregl.Map({
        container: 'map', // container id
        style: 'json/style.json',
        center: [this._config.lng, this._config.lat], // starting position [lng, lat]
        zoom: this._config.zoom, // starting zoom,
        attributionControl: false,

        transformRequest: (url: string, resourceType: string) => {
          if (resourceType == 'Tile') {
            url = `${window.location.protocol}//${window.location.host}/${url}`;
          } else if (
            resourceType == 'Source' ||
            resourceType == 'Glyphs' ||
            resourceType == 'SpriteJSON'
          ) {
            url =
              `${window.location.protocol}//${window.location.host}/` +
              url.replace('http://localhost/', '');
          } else if (resourceType == 'SpriteImage')
            url = `${window.location.protocol}//${window.location.host}/json/sprite/sprite.png`;
          else if (resourceType == 'Style') {
            url = `${window.location.protocol}//${window.location.host}/${url}`;
          } else {
            console.log(resourceType, url);
          }
          return {
            url: url,
            resourceType: resourceType,
            credentials: 'include',
          };
        },
      });

      //---------------------------------------------------------------------------
      //Add layer manipulator control
      //---------------------------------------------------------------------------
      setInfoBarCoords(this._config.lat, this._config.lng);
      setInfoBarZoom(this._config.zoom);

      this._map.addControl(layerManipulator, 'top-right');
      this._map.addControl(drawer, 'top-right');
      this._map.addControl(TileGrid, 'top-right');
      this._map.addControl(CachedMap, 'top-right');
      drawer.restoreSavedDrawings();

      this._map.on('error', (e) => {
        console.log(e);
      });

      this._map.on('style.load', () => {
        this.updateProjection();
      });
      //------------------------------------------------------------------------
      //Save current map center+zoom, to restore after loading
      //------------------------------------------------------------------------
      this._map.on('moveend', () => {
        this._mapMoveCount++;
        if (this._mapMoveCount > 2) {
          const coords = this._map?.getCenter();
          this._config.lat = coords?.lat as number;
          this._config.lng = coords?.lng as number;
          this._config.zoom = this._map?.getZoom() as number;
          setInfoBarZoom(this._config.zoom);
        }
      });
      this._map.on('mousemove', (e) => {
        setInfoBarCoords(e.lngLat.lat, e.lngLat.lng);
      });

      this._map.on('zoom', () => {
        setInfoBarZoom(this._map?.getZoom() as number);
      });

      //
    }
    return this._map;
  }

  /**
   * Force maplibre instance to reinitialize.
   */
  public forceReload() {
    if (this._map) {
      this.destroyRouteHistoryHover();
      const currentMap = this._map;
      const container = currentMap.getContainer();
      const safeRemoveControl = (control: maplibregl.IControl, label: string) => {
        try {
          currentMap.removeControl(control);
        } catch (error) {
          console.warn(`Failed to remove ${label} control`, error);
        }
      };
      safeRemoveControl(layerManipulator, 'layer manipulator');
      safeRemoveControl(drawer, 'drawer');
      safeRemoveControl(TileGrid, 'tile grid');
      safeRemoveControl(CachedMap, 'cached map');
      try {
        currentMap.remove();
      } catch (error) {
        console.warn('Failed to remove map instance cleanly', error);
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      } finally {
        this._map = null;
        this._mapMoveCount = 0;
      }
    }
    this.init();
    this.initRouteHistoryHover();
  }

  public updateProjection() {
    if (!this._map) return;
    const settings = useSettingsStore();
    if (settings.globe) {
      //@ts-expect-error not in types
      this._map.setProjection({
        type: 'globe', // Set projection to globe
      });
    } else {
      //@ts-expect-error not in types
      this._map.setProjection({
        type: 'mercator', // Set projection to mercator
      });
    }
  }

  public initRouteHistoryHover() {
    if (!this._map) return;
    this.destroyRouteHistoryHover();

    const syncHistoryRouteLayer = () => {
      try {
        this.ensureRouteHistoryLayers();
        this.refreshRouteHistoryData();
      } catch {
        return;
      }
    };

    this._styleDataHandler = syncHistoryRouteLayer;
    syncHistoryRouteLayer();
    this._map.on('styledata', this._styleDataHandler);
    this._unsubscribeRouteHistory = this._routeHistory.$subscribe(() => {
      syncHistoryRouteLayer();
    });

    this._mouseMoveHandler = (event: maplibregl.MapMouseEvent) => {
      if (!this._map) return;
      const features = this._map.queryRenderedFeatures(event.point, {
        layers: [ROUTE_HISTORY_LAYER_MAIN_ID],
      });
      const routeIDValue = features[0]?.properties?.routeID;
      const routeID = typeof routeIDValue === 'number' ? routeIDValue : Number(routeIDValue);
      if (Number.isFinite(routeID)) {
        this.setHoveredRoute(routeID);
      } else {
        this.setHoveredRoute(null);
      }
    };

    this._mouseOutHandler = () => {
      this.setHoveredRoute(null);
    };

    this._map.on('mousemove', this._mouseMoveHandler);
    this._map.on('mouseout', this._mouseOutHandler);
  }

  public destroyRouteHistoryHover() {
    if (!this._map) return;

    if (this._styleDataHandler) {
      this._map.off('styledata', this._styleDataHandler);
      this._styleDataHandler = null;
    }
    if (this._mouseMoveHandler) {
      this._map.off('mousemove', this._mouseMoveHandler);
      this._mouseMoveHandler = null;
    }
    if (this._mouseOutHandler) {
      this._map.off('mouseout', this._mouseOutHandler);
      this._mouseOutHandler = null;
    }
    if (this._unsubscribeRouteHistory) {
      this._unsubscribeRouteHistory();
      this._unsubscribeRouteHistory = null;
    }

    this.setHoveredRoute(null);
    this._routeHoverMeasure.clear();
    this._map.getCanvas().style.cursor = '';
  }

  private getDistanceUnitLabel(): string {
    const unitKey = this._config.units;
    if (unitKey === 'kilometer') return 'km';
    if (unitKey === 'mile') return 'mi';
    if (unitKey === 'meter') return 'm';
    if (unitKey === 'foot') return 'ft';
    if (unitKey === 'yard') return 'yd';
    return 'nmi';
  }

  private formatDistanceMeters(distanceMeters: number): string {
    const unitKey = this._config.units;
    const distanceUnitFactor = DistanceUnits[unitKey] ?? DistanceUnits.nmile;
    const value = distanceMeters / distanceUnitFactor;
    const digits = value >= 100 ? 1 : 2;
    return `${value.toFixed(digits)} ${this.getDistanceUnitLabel()}`;
  }

  private getRouteName(routeID: number): string {
    const route = Routes.routes.value.find((item) => item.ID === routeID);
    return route?.name ?? `Route ${routeID}`;
  }

  private setRouteHoverFilters(routeID: number | null) {
    if (!this._map) return;
    const activeRouteID = routeID ?? NO_HOVER_ROUTE_ID;
    if (this._map.getLayer(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID)) {
      this._map.setFilter(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID, ['==', 'routeID', activeRouteID]);
    }
    if (this._map.getLayer(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID)) {
      this._map.setFilter(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID, ['==', 'routeID', activeRouteID]);
    }
  }

  private setHoveredRoute(routeID: number | null) {
    if (!this._map) return;
    if (this._hoveredRouteID === routeID) return;

    this._hoveredRouteID = routeID;
    this.setRouteHoverFilters(routeID);

    if (routeID == null) {
      this._routeHoverMeasure.clear();
      this._map.getCanvas().style.cursor = '';
      return;
    }

    const routeData = this._routeHistory.byID(routeID);
    if (!routeData) {
      this._routeHoverMeasure.clear();
      this._map.getCanvas().style.cursor = '';
      return;
    }

    this._routeHoverMeasure.set({
      name: this.getRouteName(routeID),
      total: this.formatDistanceMeters(routeData.lengthMeters),
    });
    this._map.getCanvas().style.cursor = 'pointer';
  }

  private ensureRouteHistoryLayers() {
    if (!this._map) return;

    if (!this._map.getSource(ROUTE_HISTORY_SOURCE_ID)) {
      this._map.addSource(ROUTE_HISTORY_SOURCE_ID, {
        type: 'geojson',
        data: this._routeHistory.featureCollection,
      });
    }

    if (!this._map.getLayer(ROUTE_HISTORY_LAYER_MAIN_ID)) {
      this._map.addLayer({
        id: ROUTE_HISTORY_LAYER_MAIN_ID,
        type: 'line',
        source: ROUTE_HISTORY_SOURCE_ID,
        paint: {
          'line-color': this._poiStore.style.polygonColor,
          'line-width': 2,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });
    }

    if (!this._map.getLayer(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID)) {
      this._map.addLayer({
        id: ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID,
        type: 'line',
        source: ROUTE_HISTORY_SOURCE_ID,
        filter: ['==', 'routeID', NO_HOVER_ROUTE_ID],
        paint: {
          'line-color': '#ffffff',
          'line-width': 6,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });
    }

    if (!this._map.getLayer(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID)) {
      this._map.addLayer({
        id: ROUTE_HISTORY_LAYER_HOVER_MAIN_ID,
        type: 'line',
        source: ROUTE_HISTORY_SOURCE_ID,
        filter: ['==', 'routeID', NO_HOVER_ROUTE_ID],
        paint: {
          'line-color': this._poiStore.style.polygonColor,
          'line-width': 4,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });
    }

    this.setRouteHoverFilters(this._hoveredRouteID);
  }

  private refreshRouteHistoryData() {
    if (!this._map) return;
    const source = this._map.getSource(ROUTE_HISTORY_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;
    source.setData(this._routeHistory.featureCollection);
  }
}

//--------------------------------------------------------------------------
//Map instance
//--------------------------------------------------------------------------
let MapInstance: MaptoriumMap | null = null;
//--------------------------------------------------------------------------
//Map instance creation function
//--------------------------------------------------------------------------
export function createMap() {
  if (!MapInstance) {
    MapInstance = new MaptoriumMap();
  }
  return MapInstance;
}
//--------------------------------------------------------------------------
//Map instance exporting function
//--------------------------------------------------------------------------
export function getMap(): MaptoriumMap {
  if (!MapInstance) {
    throw new Error('Map not initialized! Call createMap() in boot file after app.use(pinia)');
  }
  return MapInstance;
}

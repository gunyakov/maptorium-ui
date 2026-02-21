//--------------------------------------------------------------------------
//Import stores and composables
//--------------------------------------------------------------------------
import { type SettingsStore, useSettingsStore } from 'src/stores/settings';

import { layerManipulator } from 'src/map/LayerManipulator';
import { drawer } from 'src/map/Drawer';
import TileGrid from 'src/map/TileGrid';
//--------------------------------------------------------------------------
//Map class to handle all nessesary functions
//--------------------------------------------------------------------------
class MaptoriumMap {
  private _map: maplibregl.Map | null = null;
  private _mapMoveCount: number = 0;
  private _config: SettingsStore;
  private _moveCounter: number = 0;

  constructor() {
    this._config = useSettingsStore();
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
      this._map.addControl(layerManipulator, 'top-right');
      this._map.addControl(drawer, 'top-right');
      this._map.addControl(TileGrid, 'top-right');
      drawer.restoreSavedDrawings();

      this._map.on('error', (e) => {
        console.log(e);
      });

      this._map.on('styledata', () => {});

      this._map.on('moveend', () => {
        this._mapMoveCount++;
        if (this._mapMoveCount > 2) {
          const coords = this._map?.getCenter();
          this._config.lat = coords?.lat as number;
          this._config.lng = coords?.lng as number;
          this._config.zoom = this._map?.getZoom() as number;
        }
      });

      //
    }
    //------------------------------------------------------------------------
    //Save current map center+zoom, to restore after loading
    //------------------------------------------------------------------------
    this._map.on('moveend', () => {
      //Increase movement counter for 1
      this._moveCounter++;
      //If move counter less tahn 4, skip action.
      //Required to prevent initial map move trigers, when
      //called set mapCenter what is trigered moveend also.
      if (this._moveCounter < 4) return;
      if (!this._map) return;
      //Get map center
      const coords = this._map.getCenter();
      //If coords is 0, map was initialy loaded, skip setting default coords
      if (coords.lat != 0 && coords.lng != 0) this._config.lat = coords.lat;
      this._config.lng = coords.lng;
      this._config.zoom = Math.round(this._map.getZoom());
    });
    return this._map;
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
